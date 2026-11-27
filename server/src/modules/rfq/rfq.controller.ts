import { Response } from 'express'
import { RFQService } from './rfq.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { AuthRequest } from '../../middlewares/auth.middleware.js'

export class RFQController {
  static async createRFQ(req: AuthRequest, res: Response) {
    try {
      const { sector, originCity, destinationCity, cargoDetails, budgetMax } = req.body
      const rfq = await RFQService.createRFQ({
        importerId: req.user!.id,
        sector,
        originCity,
        destinationCity,
        cargoDetails: typeof cargoDetails === 'object' ? JSON.stringify(cargoDetails) : cargoDetails,
        budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
      })
      return sendSuccess(res, rfq, 'تم إنشاء طلب التسعير بنجاح', 201)
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getOpenMarketRFQs(_req: AuthRequest, res: Response) {
    try {
      const rfqs = await RFQService.getOpenMarketRFQs()
      return sendSuccess(res, rfqs, 'تم استرجاع طلبات التسعير المتاحة في السوق')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getMyRFQs(req: AuthRequest, res: Response) {
    try {
      const rfqs = await RFQService.getMyRFQs(req.user!.id)
      return sendSuccess(res, rfqs, 'تم استرجاع طلبات التسعير الخاصة بك بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async submitQuote(req: AuthRequest, res: Response) {
    try {
      const { rfqId, price, transitDays, notes } = req.body
      const quote = await RFQService.submitQuote({
        rfqId,
        providerId: req.user!.id,
        price: parseFloat(price),
        transitDays: parseInt(transitDays, 10),
        notes,
      })
      return sendSuccess(res, quote, 'تم تقديم عرض السعر بنجاح', 201)
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async acceptQuote(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const result = await RFQService.acceptQuote(id, req.user!.id)
      return sendSuccess(res, result, 'تم اعتماد العرض وإنشاء الشحنة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
