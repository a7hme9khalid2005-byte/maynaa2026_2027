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

  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query as { q?: string }
      const results = await AdminService.globalSearch(q || '')
      return sendSuccess(res, results, 'نتائج البحث السريع')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
