import { prisma } from '../../config/prisma.js'
import { generateZatcaQR } from '../../utils/zatca.util.js'
import { ENV } from '../../config/env.js'

export class FinanceService {
  // 1. فحص حالة الفترة التجريبية (3 أيام مجانية) ونسبة العمولة للمستخدم
  static async getUserTrialStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, createdAt: true, trialEndsAt: true, role: true },
    })

    if (!user) {
      throw new Error('المستخدم غير موجود')
    }

    let trialEnd = user.trialEndsAt
    if (!trialEnd) {
      // إذا لم يكن محدداً مسبقاً، تحسب 3 أيام من تاريخ إنشاء الحساب
      trialEnd = new Date(user.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)
      await prisma.user.update({
        where: { id: userId },
        data: { trialEndsAt: trialEnd },
      })
    }

    const now = new Date()
    const isTrialActive = now < trialEnd
    const remainingMs = trialEnd.getTime() - now.getTime()
    const daysRemaining = isTrialActive ? Math.ceil(remainingMs / (1000 * 60 * 60 * 24)) : 0
    const hoursRemaining = isTrialActive ? Math.ceil(remainingMs / (1000 * 60 * 60)) : 0

    // العمولة 0% خلال فترة الـ 3 أيام المجانية، و2.5% بعد انتهائها
    const commissionRate = isTrialActive ? 0.0 : 0.025

    return {
      isTrialActive,
      daysRemaining,
      hoursRemaining,
      trialEndsAt: trialEnd,
      commissionRate,
      commissionPercentage: isTrialActive ? 0.0 : 2.5,
    }
  }

  // 2. استرجاع بيانات الحساب البنكي لمزود الخدمة الخاص بالشحنة (التحويل البنكي الخارجي)
  static async getProviderBankDetails(shipmentId: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            companyProfile: true,
          },
        },
      },
    })

    if (!shipment) {
      throw new Error('الشحنة غير موجودة')
    }

    const profile = shipment.provider.companyProfile
    return {
      providerId: shipment.provider.id,
      companyName: profile?.companyNameAr || shipment.provider.fullName,
      bankName: profile?.bankName || 'مصرف الراجحي',
      ibanNumber: profile?.ibanNumber || 'SA4480000123456789012345',
      crNumber: profile?.crNumber || '1010000000',
    }
  }

  // استرجاع سجل الحوالات البنكية الخاصة بالمستورد الحالي
  static async getImporterTransfers(importerId: string) {
    return prisma.bankTransferTransaction.findMany({
      where: { payerId: importerId },
      include: {
        invoice: {
          include: {
            shipment: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 3. رفع المستورد لإشعار التحويل البنكي الخارجي وإرساله لتدقيق الأدمن أولاً
  static async submitTransferToAdmin(params: {
    invoiceId?: string
    payerId: string
    currency?: string // USD, DINAR, EUR
    senderBankName: string
    senderAccountName: string
    transferRefNumber: string
    transferAmount?: number
    subtotalAmount?: number
    transferDate: Date
    receiptFileUrl: string
  }) {
    let invoice: any = null
    if (params.invoiceId) {
      invoice = await prisma.invoice.findFirst({
        where: {
          OR: [
            { id: params.invoiceId },
            { invoiceNumber: params.invoiceId },
            { shipmentId: params.invoiceId },
            { shipment: { trackingNumber: params.invoiceId } },
          ],
        },
        include: {
          shipment: {
            include: {
              provider: {
                include: { companyProfile: true },
              },
            },
          },
        },
      })
    }

    // إذا لم تكن الفاتورة محددة، نربطها بأحدث شحنة للعميل أو ننشئ فاتورة نظامية
    if (!invoice) {
      let shipment = await prisma.shipment.findFirst({
        where: { importerId: params.payerId },
        include: {
          invoice: true,
          provider: { include: { companyProfile: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!shipment) {
        // نربط بمزود خدمة معتمد
        const provider = await prisma.user.findFirst({
          where: { role: 'PROVIDER' },
          include: { companyProfile: true },
        })

        if (!provider) throw new Error('لا يوجد مزود خدمة متاح')

        shipment = await prisma.shipment.create({
          data: {
            trackingNumber: `SHN-2026-${Math.floor(100 + Math.random() * 900)}`,
            sector: 'SEA_FREIGHT',
            originName: 'شنغهاي - الصين',
            destName: 'ميناء الملك عبد العزيز - الدمام',
            importerId: params.payerId,
            providerId: provider.id,
            status: 'PENDING_PAYMENT',
          },
          include: {
            invoice: true,
            provider: { include: { companyProfile: true } },
          },
        })
      }

      if (shipment.invoice) {
        invoice = await prisma.invoice.findUnique({
          where: { id: shipment.invoice.id },
          include: {
            shipment: {
              include: {
                provider: { include: { companyProfile: true } },
              },
            },
          },
        })
      } else {
        const invSubtotal = params.subtotalAmount || 1000.0
        const invTax = parseFloat((invSubtotal * 0.15).toFixed(2))
        const invTotal = parseFloat((invSubtotal + invTax).toFixed(2))

        invoice = await prisma.invoice.create({
          data: {
            invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            shipmentId: shipment.id,
            subtotal: invSubtotal,
            taxAmount: invTax,
            totalAmount: invTotal,
            currency: params.currency || 'USD',
            commissionRate: 0.025,
            commissionAmount: parseFloat((invSubtotal * 0.025).toFixed(2)),
            providerPayoutNet: invSubtotal,
            paymentStatus: 'UNPAID',
          },
          include: {
            shipment: {
              include: {
                provider: { include: { companyProfile: true } },
              },
            },
          },
        })
      }
    }

    if (!invoice) {
      throw new Error('تعذر إيجاد أو إنشاء فاتورة للحوالة')
    }

    if (
      invoice.paymentStatus === 'PAID_TO_PROVIDER' ||
      invoice.paymentStatus === 'ESCROW_HOLD'
    ) {
      throw new Error('تم سداد هذه الفاتورة وتأكيدها مسبقاً')
    }

    // فحص الفترة التجريبية للعميل
    const trialStatus = await this.getUserTrialStatus(params.payerId)
    const currency = params.currency || invoice.currency || 'USD'
    const subtotal = params.subtotalAmount || invoice.subtotal || 1000.0
    const commissionRate = trialStatus.commissionRate // 0.0 أو 0.025
    const commissionAmount = parseFloat((subtotal * commissionRate).toFixed(2))
    const totalAmount = params.transferAmount || parseFloat((subtotal + commissionAmount).toFixed(2))

    const provider = invoice.shipment.provider
    const profile = provider.companyProfile

    // إنشاء سجل الحوالة البنكية الموجهة لتدقيق الأدمن أولاً
    const transfer = await prisma.bankTransferTransaction.create({
      data: {
        invoiceId: invoice.id,
        payerId: params.payerId,
        recipientProviderId: provider.id,
        recipientBankName: profile?.bankName || 'مصرف الراجحي',
        recipientIban: profile?.ibanNumber || 'SA4480000123456789012345',
        recipientName: profile?.companyNameAr || provider.fullName,
        senderBankName: params.senderBankName,
        senderAccountName: params.senderAccountName,
        transferRefNumber: params.transferRefNumber,
        currency,
        subtotalAmount: subtotal,
        isTrialPeriod: trialStatus.isTrialActive,
        commissionRate,
        commissionAmount,
        transferAmount: totalAmount,
        transferDate: params.transferDate,
        receiptFileUrl: params.receiptFileUrl,
        status: 'SUBMITTED_TO_ADMIN', // في انتظار تدقيق الأدمن أولاً
      },
    })

    // تحديث حالة الفاتورة
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        currency,
        isTrialPeriod: trialStatus.isTrialActive,
        commissionRate,
        commissionAmount,
        totalAmount,
        paymentStatus: 'SUBMITTED_TO_ADMIN',
      },
    })

    return {
      transfer,
      trialStatus,
      message: 'تم إرسال إشعار التحويل بنجاح إلى الإدارة للتدقيق قبل إحالته لمزود الخدمة',
    }
  }

  // 4. استرجاع الحوالات المعلقة لتدقيق الأدمن
  static async getAdminPendingTransfers() {
    return prisma.bankTransferTransaction.findMany({
      where: {
        status: 'SUBMITTED_TO_ADMIN',
      },
      include: {
        invoice: {
          include: { shipment: true },
        },
        payer: {
          select: { id: true, fullName: true, email: true, phone: true, trialEndsAt: true },
        },
        recipientProvider: {
          select: { id: true, fullName: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 5. تدقيق وموافقة الأدمن على الإشعار وتمريره لمزود الخدمة
  static async approveTransferByAdmin(transferId: string, adminId: string, notes?: string) {
    const transfer = await prisma.bankTransferTransaction.findUnique({
      where: { id: transferId },
      include: { invoice: true },
    })

    if (!transfer) {
      throw new Error('معاملة التحويل غير موجودة')
    }

    if (transfer.status !== 'SUBMITTED_TO_ADMIN') {
      throw new Error('هذه الحوالة ليست في حالة انتظار تدقيق الإدارة')
    }

    // تحديث حالة الحوالة إلى معتمدة من الإدارة وبانتظار تأكيد المزود
    const updatedTransfer = await prisma.bankTransferTransaction.update({
      where: { id: transferId },
      data: {
        status: 'APPROVED_BY_ADMIN_PENDING_PROVIDER',
        adminApprovedAt: new Date(),
        adminReviewedByUserId: adminId,
        adminNotes: notes || 'تم التحقق من صحة الإشعار واحتساب العمولة بنجاح',
      },
    })

    await prisma.invoice.update({
      where: { id: transfer.invoiceId },
      data: {
        paymentStatus: 'APPROVED_BY_ADMIN_PENDING_PROVIDER',
      },
    })

    return {
      message: 'تم تدقيق الإشعار واعتماده بنجاح وتمريره لمزود الخدمة للتحقق من حسابه البنكي',
      transfer: updatedTransfer,
    }
  }

  // 6. رفض الأدمن للإشعار مع كتابة السبب
  static async rejectTransferByAdmin(transferId: string, adminId: string, reason: string) {
    const transfer = await prisma.bankTransferTransaction.findUnique({
      where: { id: transferId },
    })

    if (!transfer) {
      throw new Error('معاملة التحويل غير موجودة')
    }

    const updatedTransfer = await prisma.bankTransferTransaction.update({
      where: { id: transferId },
      data: {
        status: 'REJECTED_BY_ADMIN',
        rejectionReason: reason,
        adminReviewedByUserId: adminId,
        reviewedAt: new Date(),
      },
    })

    await prisma.invoice.update({
      where: { id: transfer.invoiceId },
      data: {
        paymentStatus: 'UNPAID',
      },
    })

    return {
      message: 'تم رفض الإشعار من قِبل الإدارة وإشعار المستورد بالسبب',
      transfer: updatedTransfer,
    }
  }

  // 7. استرجاع الحوالات المعلقة لمزود الخدمة (فقط المعتمدة مسبقاً من الأدمن)
  static async getProviderPendingTransfers(providerId: string) {
    return prisma.bankTransferTransaction.findMany({
      where: {
        recipientProviderId: providerId,
        status: 'APPROVED_BY_ADMIN_PENDING_PROVIDER',
      },
      include: {
        invoice: {
          include: { shipment: true },
        },
        payer: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 8. تأكيد واعتماد مزود الخدمة لوصول الحوالة إلى حسابه البنكي الفعلي ⬅️ تفعيل الشحنة
  static async confirmTransferByProvider(transferId: string, providerId: string) {
    const transfer = await prisma.bankTransferTransaction.findUnique({
      where: { id: transferId },
      include: {
        invoice: {
          include: {
            shipment: {
              include: { provider: { include: { companyProfile: true } } },
            },
          },
        },
      },
    })

    if (!transfer) {
      throw new Error('معاملة التحويل غير موجودة')
    }

    if (transfer.recipientProviderId !== providerId) {
      throw new Error('غير مصرح لك باعتماد هذه الحوالة')
    }

    if (transfer.status === 'CONFIRMED_BY_PROVIDER') {
      throw new Error('تم تأكيد هذه الحوالة مسبقاً')
    }

    const providerProfile = transfer.invoice.shipment.provider.companyProfile

    // توليد ZATCA QR Code
    const zatcaQr = generateZatcaQR({
      sellerName: providerProfile?.companyNameAr || ENV.PLATFORM_COMPANY_NAME,
      vatNumber: providerProfile?.vatNumber || ENV.PLATFORM_VAT_NUMBER,
      timestamp: new Date().toISOString(),
      totalWithVat: transfer.invoice.totalAmount.toFixed(2),
      vatAmount: transfer.invoice.taxAmount.toFixed(2),
    })

    // تحديث الحوالة كمؤكدة من المزود
    await prisma.bankTransferTransaction.update({
      where: { id: transferId },
      data: {
        status: 'CONFIRMED_BY_PROVIDER',
        providerConfirmedAt: new Date(),
        reviewedByUserId: providerId,
        reviewedAt: new Date(),
      },
    })

    // تحديث الفاتورة كمدفوعة بالكامل لمزود الخدمة
    await prisma.invoice.update({
      where: { id: transfer.invoiceId },
      data: {
        paymentStatus: 'PAID_TO_PROVIDER',
        zatcaQrCode: zatcaQr,
      },
    })

    // تحديث الشحنة لتصبح جاهزة للانطلاق والتحميل (READY_FOR_PICKUP)
    await prisma.shipment.update({
      where: { id: transfer.invoice.shipmentId },
      data: {
        status: 'READY_FOR_PICKUP',
      },
    })

    return {
      message: 'تم تأكيد استلام الحوالة في الحساب البنكي وتفعيل الشحنة للانطلاق بنجاح',
      zatcaQrCode: zatcaQr,
    }
  }

  // 9. رفض مزود الخدمة للإشعار لعدم وصول الحوالة لحسابه
  static async rejectTransferByProvider(
    transferId: string,
    providerId: string,
    reason: string
  ) {
    const transfer = await prisma.bankTransferTransaction.findUnique({
      where: { id: transferId },
    })

    if (!transfer) {
      throw new Error('معاملة التحويل غير موجودة')
    }

    if (transfer.recipientProviderId !== providerId) {
      throw new Error('غير مصرح لك برفض هذه الحوالة')
    }

    await prisma.bankTransferTransaction.update({
      where: { id: transferId },
      data: {
        status: 'REJECTED_BY_PROVIDER',
        rejectionReason: reason,
        reviewedByUserId: providerId,
        reviewedAt: new Date(),
      },
    })

    await prisma.invoice.update({
      where: { id: transfer.invoiceId },
      data: {
        paymentStatus: 'UNPAID',
      },
    })

    return { message: 'تم إبلاغ الإدارة والمستورد بعدم وصول الحوالة للحساب البنكي' }
  }

  // 10. استرجاع الحسابات البنكية للمنصة
  static async getPlatformBankAccounts() {
    return prisma.platformBankAccount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  // 11. رقابة وتدقيق الأدمن على كافة الحوالات
  static async getAllDirectTransfers() {
    return prisma.bankTransferTransaction.findMany({
      include: {
        invoice: { include: { shipment: true } },
        payer: { select: { id: true, fullName: true, phone: true } },
        recipientProvider: { select: { id: true, fullName: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}
