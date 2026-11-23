import { Router } from 'express'
import { RFQController } from './rfq.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'

const router = Router()

// إنشاء طلب تسعير (خاص بالمستورد)
router.post('/', authenticate, requireRole('IMPORTER', 'SUPER_ADMIN'), RFQController.createRFQ)

// استعراض طلبات السوق (لمزودي الخدمة)
router.get('/market', authenticate, RFQController.getOpenMarketRFQs)

// تقديم عرض سعر (لمزود الخدمة)
router.post('/quote', authenticate, requireRole('PROVIDER', 'SUPER_ADMIN'), RFQController.submitQuote)

// قبول العرض (خاص بالمستورد)
router.post('/quote/:id/accept', authenticate, requireRole('IMPORTER', 'SUPER_ADMIN'), RFQController.acceptQuote)

export default router
