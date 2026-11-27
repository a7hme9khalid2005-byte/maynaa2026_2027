import { Router } from 'express'
import { AdminController } from './admin.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'

const router = Router()

router.get('/kpis', authenticate, requireRole('SUPER_ADMIN'), AdminController.getKPIs)
router.get('/users', authenticate, requireRole('SUPER_ADMIN'), AdminController.getUsers)
router.patch('/users/:id/status', authenticate, requireRole('SUPER_ADMIN'), AdminController.updateUserStatus)
router.get('/config', authenticate, AdminController.getConfig)
router.put('/commissions', authenticate, requireRole('SUPER_ADMIN'), AdminController.updateCommissions)
router.get('/search', authenticate, AdminController.search)

export default router
