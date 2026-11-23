import { Response } from 'express'
import { ShipmentsService } from './shipments.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { AuthRequest } from '../../middlewares/auth.middleware.js'

export class ShipmentsController {
  static async getShipments(req: AuthRequest, res: Response) {
    try {
      const { status } = req.query as { status?: string }
      const shipments = await ShipmentsService.getShipments(req.user!, { status })
      return sendSuccess(res, shipments, 'تم استرجاع قائمة الشحنات بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getShipmentById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const shipment = await ShipmentsService.getShipmentById(id)
      return sendSuccess(res, shipment, 'تم استرجاع تفاصيل الشحنة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body
      const shipment = await ShipmentsService.updateStatus(id, status)
      return sendSuccess(res, shipment, 'تم تحديث حالة الشحنة بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
