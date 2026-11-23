import { Router } from 'express'
import { DocumentsController } from './documents.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { uploadReceipt } from '../../middlewares/upload.middleware.js'

const router = Router()

router.post('/upload', authenticate, uploadReceipt.single('file'), DocumentsController.uploadDocument)
router.get('/shipment/:shipmentId', authenticate, DocumentsController.getShipmentDocuments)

export default router
