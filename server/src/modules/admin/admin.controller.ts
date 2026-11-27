import { Request, Response } from 'express'
import { AdminService } from './admin.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'

export class AdminController {
  static async getKPIs(_req: Request, res: Response) {
    try {
      const kpis = await AdminService.getDashboardKPIs()
      return sendSuccess(res, kpis, 'تم استرجاع إحصائيات لوحة التحكم')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getConfig(_req: Request, res: Response) {
    try {
      const config = await AdminService.getPlatformConfig()
      return sendSuccess(res, config, 'تم استرجاع إعدادات المنصة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async updateCommissions(req: Request, res: Response) {
    try {
      const { commissionSea, commissionAir, commissionLand, commissionCustom } = req.body
      const updated = await AdminService.updateCommissions({
        commissionSea: parseFloat(commissionSea),
        commissionAir: parseFloat(commissionAir),
        commissionLand: parseFloat(commissionLand),
        commissionCustom: parseFloat(commissionCustom),
      })
      return sendSuccess(res, updated, 'تم تحديث نسب العمولات بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async updatePolicy(req: Request, res: Response) {
    try {
      const {
        termsText,
        privacyText,
        emailGatewayEnabled,
        emailGatewayAddress,
        smsGatewayEnabled,
        smsGatewaySender,
        webhookEnabled,
        webhookUrl,
      } = req.body
      const updated = await AdminService.updatePolicy({
        termsText,
        privacyText,
        emailGatewayEnabled,
        emailGatewayAddress,
        smsGatewayEnabled,
        smsGatewaySender,
        webhookEnabled,
        webhookUrl,
      })
      return sendSuccess(res, updated, 'تم تحديث نصوص السياسات والشروط وبوابات الربط بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query as { q?: string }
      const results = await AdminService.globalSearch(q || '')
      return sendSuccess(res, results, 'نتائج البحث السريع')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getUsers(_req: Request, res: Response) {
    try {
      const users = await AdminService.getUsers()
      return sendSuccess(res, users, 'تم استرجاع قائمة المستخدمين من قاعدة البيانات')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body
      const updated = await AdminService.updateUserStatus(id, status)
      return sendSuccess(res, updated, 'تم تحديث حالة المستخدم بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      await AdminService.deleteUser(id)
      return sendSuccess(res, null, 'تم حذف المستخدم من قاعدة البيانات بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getSupportTickets(req: Request, res: Response) {
    try {
      const { type } = req.query as { type?: string }
      const tickets = await AdminService.getSupportTickets(type)
      return sendSuccess(res, tickets, 'تم استرجاع تذاكر الدعم والرسائل الموحدة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async updateSupportTicket(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status, reply, agentName } = req.body
      const updated = await AdminService.updateSupportTicket(id, { status, reply, agentName })
      return sendSuccess(res, updated, 'تم تحديث تذكرة الدعم الفني بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async createSupportTicket(req: Request, res: Response) {
    try {
      const created = await AdminService.createSupportTicket(req.body)
      return sendSuccess(res, created, 'تم إنشاء تذكرة دعم أو رسالة جديدة بنجاح', 201)
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getActivityLogs(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
      const logs = await AdminService.getActivityLogs(limit)
      return sendSuccess(res, logs, 'تم استرجاع سجل الأنشطة الحية')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getInvoices(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
      const invoices = await AdminService.getInvoices(limit)
      return sendSuccess(res, invoices, 'تم استرجاع الفواتير المعتمدة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
