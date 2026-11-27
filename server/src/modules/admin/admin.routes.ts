import { Router } from 'express'
import { AdminController } from './admin.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'

const router = Router()

router.get('/kpis', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), AdminController.getKPIs)
router.get('/users', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), AdminController.getUsers)
router.patch('/users/:id/status', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), AdminController.updateUserStatus)
router.delete('/users/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), AdminController.deleteUser)
router.get('/config', authenticate, AdminController.getConfig)
router.put('/commissions', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), AdminController.updateCommissions)
router.put('/policy', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), AdminController.updatePolicy)
router.get('/search', authenticate, AdminController.search)

export default router
