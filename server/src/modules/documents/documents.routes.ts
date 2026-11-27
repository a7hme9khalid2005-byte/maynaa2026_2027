import { Router } from 'express'
import { DocumentsController } from './documents.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { uploadReceipt } from '../../middlewares/upload.middleware.js'

const router = Router()

router.post('/upload', authenticate, uploadReceipt.single('file'), DocumentsController.uploadDocument)
router.post('/', authenticate, uploadReceipt.single('file'), DocumentsController.uploadDocument)
router.get('/', authenticate, DocumentsController.getMyDocuments)
router.get('/my', authenticate, DocumentsController.getMyDocuments)
router.get('/shipment/:shipmentId', authenticate, DocumentsController.getShipmentDocuments)
router.delete('/:id', authenticate, DocumentsController.deleteDocument)

export default router
