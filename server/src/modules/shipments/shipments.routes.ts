import { Router } from 'express'
import { ShipmentsController } from './shipments.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/', authenticate, ShipmentsController.getShipments)
router.get('/:id', authenticate, ShipmentsController.getShipmentById)
router.patch('/:id/status', authenticate, ShipmentsController.updateStatus)

export default router
