import { Response } from 'express'
import { DocumentsService } from './documents.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { AuthRequest } from '../../middlewares/auth.middleware.js'

export class DocumentsController {
  static async uploadDocument(req: AuthRequest, res: Response) {
    try {
      const { shipmentId, docType, status } = req.body
      const userId = req.user?.id

      let fileUrl = '/uploads/sample-doc.pdf'
      let fileName = 'مستند_رسمي.pdf'
      let fileSize = 1024 * 1024

      if (req.file) {
        fileUrl = `/uploads/${req.file.filename}`
        fileName = req.file.originalname
        fileSize = req.file.size
      } else if (req.body.fileName) {
        fileName = req.body.fileName
        fileUrl = req.body.fileUrl || '/uploads/sample-doc.pdf'
      }

      const doc = await DocumentsService.uploadDocument({
        shipmentId: shipmentId || undefined,
        userId,
        docType: docType || 'COMMERCIAL_INVOICE',
        fileName,
        fileUrl,
        fileSize,
        status: status || 'APPROVED',
      })

      return sendSuccess(res, doc, 'تم حفظ المستند بنجاح', 201)
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getMyDocuments(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return sendError(res, 'يجب تسجيل الدخول', 401)
      const docs = await DocumentsService.getUserDocuments(userId)
      return sendSuccess(res, docs, 'تم جلب المستندات بنجاح')
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

  static async deleteDocument(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return sendError(res, 'غير مصرح', 401)
      const { id } = req.params
      await DocumentsService.deleteDocument(id, userId)
      return sendSuccess(res, null, 'تم حذف المستند بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
