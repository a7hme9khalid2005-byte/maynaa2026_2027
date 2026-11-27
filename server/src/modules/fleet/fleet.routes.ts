import { Router } from 'express'
import { FleetController } from './fleet.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'

const router = Router()

// استرجاع الشاحنات للخريطة
router.get('/trucks', authenticate, FleetController.getTrucks)

// إرسال الإحداثيات اللحظية (تطبيق السائق أو أجهزة التتبع)
router.post('/telemetry', authenticate, FleetController.updateTelemetry)

// التنبيهات وإغلاقها
router.get('/alerts', authenticate, FleetController.getActiveAlerts)
router.patch('/alerts/:id/resolve', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), FleetController.resolveAlert)

export default router
