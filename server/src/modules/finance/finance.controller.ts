import { Request, Response } from 'express'
import { FinanceService } from './finance.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { SocketService } from '../websocket/socket.service.js'

export class FinanceController {
  // 1. فحص حالة الفترة التجريبية (3 أيام مجانية) ونسبة العمولة
  static async getUserTrialStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'يجب تسجيل الدخول', 401)
      }
      const trial = await FinanceService.getUserTrialStatus(req.user.id)
      return sendSuccess(res, trial, 'تم جلب حالة الفترة التجريبية ونسبة العمولة بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 2. استرجاع بيانات الحساب البنكي لمزود الخدمة الخاص بالشحنة
  static async getProviderBankDetails(req: Request, res: Response) {
    try {
      const { shipmentId } = req.params
      const details = await FinanceService.getProviderBankDetails(shipmentId)
      return sendSuccess(res, details, 'تم استرجاع الحساب البنكي لمزود الخدمة بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 3. رفع المستورد للإشعار الموجه لتدقيق الأدمن أولاً
  static async submitTransferToAdmin(req: AuthRequest, res: Response) {
    try {
      const {
        invoiceId,
        currency,
        subtotalAmount,
        senderBankName,
        senderAccountName,
        transferRefNumber,
        transferAmount,
        transferDate,
      } = req.body

      let receiptFileUrl = '/uploads/sample-receipt.png'
      if (req.file) {
        receiptFileUrl = `/uploads/${req.file.filename}`
      }

      if (!req.user) {
        return sendError(res, 'يجب تسجيل الدخول', 401)
      }

      const result = await FinanceService.submitTransferToAdmin({
        invoiceId,
        payerId: req.user.id,
        currency: currency || 'USD',
        subtotalAmount: subtotalAmount ? parseFloat(subtotalAmount) : undefined,
        senderBankName,
        senderAccountName,
        transferRefNumber,
        transferAmount: transferAmount ? parseFloat(transferAmount) : undefined,
        transferDate: new Date(transferDate || Date.now()),
        receiptFileUrl,
      })

      // إشعار الأدمن عبر Socket.io
      SocketService.broadcastPaymentApproved(invoiceId, 'NEW_TRANSFER_SUBMITTED_TO_ADMIN')

      return sendSuccess(
        res,
        result,
        'تم إرسال إشعار التحويل البنكي إلى الإدارة بنجاح للتدقيق قبل اعتماده لمزود الخدمة',
        201
      )
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 4. استرجاع الحوالات المعلقة لتدقيق الأدمن
  static async getAdminPendingTransfers(_req: AuthRequest, res: Response) {
    try {
      const transfers = await FinanceService.getAdminPendingTransfers()
      return sendSuccess(res, transfers, 'تم استرجاع الحوالات المعلقة لتدقيق الإدارة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 5. موافقة الأدمن على الإشعار وتمريره لمزود الخدمة
  static async approveTransferByAdmin(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { notes } = req.body
      const adminId = req.user!.id
      const result = await FinanceService.approveTransferByAdmin(id, adminId, notes)

      // إشعار المزود عبر Socket.io بوصول إشعار مدقق من الإدارة
      SocketService.broadcastPaymentApproved(id, 'TRANSFER_APPROVED_BY_ADMIN')

      return sendSuccess(res, result, result.message)
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 6. رفض الأدمن للإشعار
  static async rejectTransferByAdmin(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { reason } = req.body
      const adminId = req.user!.id
      const result = await FinanceService.rejectTransferByAdmin(
        id,
        adminId,
        reason || 'الإشعار غير واضح أو لم يتم تضمين العمولة المطلوبة'
      )
      return sendSuccess(res, result, result.message)
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 7. استرجاع الحوالات المعلقة لمزود الخدمة (فقط المعتمدة من الأدمن)
  static async getProviderPendingTransfers(req: AuthRequest, res: Response) {
    try {
      const providerId = req.user!.id
      const transfers = await FinanceService.getProviderPendingTransfers(providerId)
      return sendSuccess(res, transfers, 'تم استرجاع الحوالات المعتمدة إدارياً بانتظار تأكيدك')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 8. تأكيد واعتماد المزود للحوالة في حسابه البنكي ⬅️ تفعيل الشحنة
  static async confirmTransferByProvider(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const providerId = req.user!.id
      const result = await FinanceService.confirmTransferByProvider(id, providerId)

      // بث إشعار WebSocket بتفعيل الشحنة
      SocketService.broadcastPaymentApproved(id, 'SHIPMENT_ACTIVATED_READY_FOR_PICKUP')

      return sendSuccess(res, result, 'تم تأكيد استلام الحوالة في الحساب البنكي وتفعيل الشحنة بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 9. رفض المزود للإشعار لعدم وصول الحوالة
  static async rejectTransferByProvider(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { reason } = req.body
      const providerId = req.user!.id
      const result = await FinanceService.rejectTransferByProvider(
        id,
        providerId,
        reason || 'الحوالة لم تظهر في حسابنا البنكي الفعلي'
      )
      return sendSuccess(res, result, 'تم تسجيل الرفض وإشعار الإدارة والمستورد')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 10. استرجاع الحسابات البنكية للمنصة
  static async getPlatformBankAccounts(_req: Request, res: Response) {
    try {
      const accounts = await FinanceService.getPlatformBankAccounts()
      return sendSuccess(res, accounts, 'تم استرجاع الحسابات البنكية المعتمدة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  // 11. استرجاع كافة الحوالات للأدمن
  static async getAllDirectTransfers(_req: AuthRequest, res: Response) {
    try {
      const transfers = await FinanceService.getAllDirectTransfers()
      return sendSuccess(res, transfers, 'تم استرجاع كافة الحوالات')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
