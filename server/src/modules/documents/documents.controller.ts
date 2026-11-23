import { Response } from 'express'
import { DocumentsService } from './documents.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { AuthRequest } from '../../middlewares/auth.middleware.js'

export class DocumentsController {
  static async uploadDocument(req: AuthRequest, res: Response) {
    try {
      const { shipmentId, docType } = req.body

      if (!req.file) {
        return sendError(res, 'يرجى إرفاق ملف المستند', 400)
      }

      const fileUrl = `/uploads/${req.file.filename}`
      const doc = await DocumentsService.uploadDocument({
        shipmentId,
        docType: docType || 'OTHER',
        fileName: req.file.originalname,
        fileUrl,
        fileSize: req.file.size,
      })

      return sendSuccess(res, doc, 'تم رفع المستند بنجاح', 201)
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getShipmentDocuments(req: AuthRequest, res: Response) {
    try {
      const { shipmentId } = req.params
      const docs = await DocumentsService.getShipmentDocuments(shipmentId)
      return sendSuccess(res, docs, 'تم استرجاع مستندات الشحنة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
