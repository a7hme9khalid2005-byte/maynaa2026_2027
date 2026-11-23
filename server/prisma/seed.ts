import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 جاري بدء تهيئة وتغذية قاعدة بيانات منصة ميناء اللوجستية...')

  const passwordHash = await bcrypt.hash('123456', 10)

  // 1. إنشاء الحسابات التجريبية للمنصة
  // أ. الأدمن العام
  const _admin = await prisma.user.upsert({
    where: { email: 'admin@meynaa.com' },
    update: {},
    create: {
      fullName: 'أحمد الإداري (مدير المنصة)',
      email: 'admin@meynaa.com',
      phone: '+966500000001',
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  })

  // ب. مزود الخدمة اللوجستية
  const provider = await prisma.user.upsert({
    where: { email: 'provider@meynaa.com' },
    update: {},
    create: {
      fullName: 'خالد الناقل (شركة الفرسان اللوجستية)',
      email: 'provider@meynaa.com',
      phone: '+966500000002',
      passwordHash,
      role: 'PROVIDER',
      status: 'ACTIVE',
      companyProfile: {
        create: {
          companyNameAr: 'شركة الفرسان للنقل البري والبحري',
          crNumber: '1010894521',
          vatNumber: '310998877600003',
          bankName: 'مصرف الراجحي',
          ibanNumber: 'SA4480000123456789012345',
          isVerified: true,
        },
      },
    },
  })

  // ج. المستورد / العميل
  const importer = await prisma.user.upsert({
    where: { email: 'importer@meynaa.com' },
    update: {},
    create: {
      fullName: 'سارة المستوردة (مؤسسة الأفق للاستيراد)',
      email: 'importer@meynaa.com',
      phone: '+966500000003',
      passwordHash,
      role: 'IMPORTER',
      status: 'ACTIVE',
      trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // متبقي يومين في الفترة التجريبية المجانية
      companyProfile: {
        create: {
          companyNameAr: 'مؤسسة الأفق للتجارة والاستيراد',
          crNumber: '1010772211',
          vatNumber: '310443322100003',
          isVerified: true,
        },
      },
    },
  })

  // د. السائق
  const driver = await prisma.user.upsert({
    where: { email: 'driver@meynaa.com' },
    update: {},
    create: {
      fullName: 'محمد وليد (كابتن الأسطول)',
      email: 'driver@meynaa.com',
      phone: '+966500000004',
      passwordHash,
      role: 'DRIVER',
      status: 'ACTIVE',
    },
  })

  // 2. الحسابات البنكية المعتمدة للمنصة (التحويل الخارجي)
  const _rajhi = await prisma.platformBankAccount.upsert({
    where: { ibanNumber: 'SA4480000456608010123456' },
    update: {},
    create: {
      bankNameAr: 'مصرف الراجحي',
      bankNameEn: 'Al Rajhi Bank',
      accountName: 'شركة ميناء للخدمات اللوجستية المحدودة',
      ibanNumber: 'SA4480000456608010123456',
      accountNum: '456608010123456',
      swiftCode: 'RJHISARI',
      currency: 'SAR',
    },
  })

  await prisma.platformBankAccount.upsert({
    where: { ibanNumber: 'SA1210000023456789012345' },
    update: {},
    create: {
      bankNameAr: 'البنك الأهلي السعودي (SNB)',
      bankNameEn: 'Saudi National Bank',
      accountName: 'شركة ميناء للخدمات اللوجستية المحدودة',
      ibanNumber: 'SA1210000023456789012345',
      accountNum: '23456789012345',
      swiftCode: 'NCBISARI',
      currency: 'SAR',
    },
  })

  // 3. أسطول الشاحنات
  const truck1 = await prisma.truck.upsert({
    where: { fleetCode: 'SHN-2026-902' },
    update: {},
    create: {
      fleetCode: 'SHN-2026-902',
      plateNumber: 'أ ب ج 1234',
      truckType: 'CONTAINER_CARRIER',
      status: 'ON_DUTY',
      providerId: provider.id,
      driverId: driver.id,
      lastLatitude: 24.7136,
      lastLongitude: 46.6753,
      lastSpeed: 85.0,
      lastTemperature: -18.0,
      lastTelemetryAt: new Date(),
    },
  })

  const truck2 = await prisma.truck.upsert({
    where: { fleetCode: 'SHN-2026-884' },
    update: {},
    create: {
      fleetCode: 'SHN-2026-884',
      plateNumber: 'د ر س 5678',
      truckType: 'REEFER',
      status: 'EMERGENCY',
      providerId: provider.id,
      lastLatitude: 21.5433,
      lastLongitude: 39.1728,
      lastSpeed: 72.0,
      lastTemperature: 7.6, // درجة حرارة مرتفعة
      lastTelemetryAt: new Date(),
    },
  })

  const _truck3 = await prisma.truck.upsert({
    where: { fleetCode: 'SHN-2026-750' },
    update: {},
    create: {
      fleetCode: 'SHN-2026-750',
      plateNumber: 'ع ن ق 9988',
      truckType: 'FLATBED',
      status: 'ON_DUTY',
      providerId: provider.id,
      lastLatitude: 26.4207,
      lastLongitude: 50.0888,
      lastSpeed: 90.0,
      lastTelemetryAt: new Date(),
    },
  })

  // 4. تنبيهات الطوارئ الحية
  await prisma.fleetAlert.createMany({
    data: [
      {
        truckId: truck1.id,
        alertType: 'OUT_OF_ROUTE',
        severity: 'HIGH',
        title: 'تنبيه خروج عن المسار المخصص',
        description: 'شاحنة رقم SHN-2026-902 انحرفت عن خط السير الرياض - جدة بمقدار 8 كم',
        latitude: 24.7136,
        longitude: 46.6753,
      },
      {
        truckId: truck2.id,
        alertType: 'HIGH_TEMP',
        severity: 'CRITICAL',
        title: 'ارتفاع حرارة الشاحنة المبردة',
        description: 'شاحنة رقم SHN-2026-884 سجلت درجة حرارة 7.6°C (تجاوز الحد المسموح)',
        latitude: 21.5433,
        longitude: 39.1728,
      },
    ],
  })

  // 5. إعدادات المنصة ونسب العمولات
  await prisma.platformConfig.upsert({
    where: { id: 'global-config' },
    update: {},
    create: {
      id: 'global-config',
      commissionSea: 2.5,
      commissionAir: 3.0,
      commissionLand: 1.5,
      commissionCustom: 1.0,
      vatPercentage: 15.0,
      termsText: 'الشروط والأحكام القياسية لمنصة ميناء اللوجستية...',
      privacyText: 'سياسة الخصوصية وحماية البيانات في منصة ميناء...',
    },
  })

  // 6. شحنة تجريبية مع فاتورة وحوالة بنكية معلقة للتدقيق
  const sampleShipment = await prisma.shipment.upsert({
    where: { trackingNumber: 'SHN-2026-884' },
    update: {},
    create: {
      trackingNumber: 'SHN-2026-884',
      importerId: importer.id,
      providerId: provider.id,
      truckId: truck2.id,
      sector: 'LAND_TRANSPORT',
      originName: 'ميناء الملك عبدالعزيز - الدمام',
      destName: 'المستودع المركزي - الرياض',
      status: 'PENDING_PAYMENT',
      cargoWeight: 14500,
      cargoVolume: 42,
    },
  })

  const sampleInvoice = await prisma.invoice.upsert({
    where: { invoiceNumber: 'INV-2026-0042' },
    update: {},
    create: {
      invoiceNumber: 'INV-2026-0042',
      shipmentId: sampleShipment.id,
      subtotal: 12000,
      taxAmount: 1800,
      totalAmount: 13800,
      currency: 'USD',
      isTrialPeriod: true,
      commissionRate: 0.0,
      commissionAmount: 0.0,
      providerPayoutNet: 13800,
      paymentStatus: 'SUBMITTED_TO_ADMIN',
    },
  })

  // حذف الحوالات السابقة لتجنب التكرار عند إعادة التشغيل
  await prisma.bankTransferTransaction.deleteMany({
    where: { invoiceId: sampleInvoice.id },
  })

  await prisma.bankTransferTransaction.create({
    data: {
      invoiceId: sampleInvoice.id,
      payerId: importer.id,
      recipientProviderId: provider.id,
      recipientBankName: 'مصرف الراجحي',
      recipientIban: 'SA4480000123456789012345',
      recipientName: 'شركة الفرسان للنقل البري والبحري',
      senderBankName: 'مصرف الإنماء',
      senderAccountName: 'مؤسسة الأفق للاستيراد',
      transferRefNumber: 'TXN-984210',
      currency: 'USD',
      subtotalAmount: 13800,
      isTrialPeriod: true,
      commissionRate: 0.0,
      commissionAmount: 0.0,
      transferAmount: 13800,
      transferDate: new Date(),
      receiptFileUrl: '/uploads/sample-receipt.png',
      status: 'SUBMITTED_TO_ADMIN', // في انتظار تدقيق الإدارة أولاً
    },
  })

  console.log('✅ اكتملت تغذية قاعدة البيانات بنجاح!')
  console.log(`👤 حساب الأدمن: admin@meynaa.com (كلمة المرور: 123456)`)
  console.log(`👤 حساب المزود: provider@meynaa.com (كلمة المرور: 123456)`)
  console.log(`👤 حساب المستورد: importer@meynaa.com (كلمة المرور: 123456)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
