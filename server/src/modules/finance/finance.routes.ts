import { Router } from 'express'
import { FinanceController } from './finance.controller.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'
import { uploadReceipt } from '../../middlewares/upload.middleware.js'

const router = Router()

// 1. فحص حالة الـ 3 أيام المجانية ونسبة العمولة للمستخدم
router.get('/trial-status', authenticate, FinanceController.getUserTrialStatus)

// 2. جلب بيانات بنك المزود الخاص بالشحنة (التحويل البنكي الخارجي)
router.get('/provider-bank/:shipmentId', authenticate, FinanceController.getProviderBankDetails)

// 3. رفع المستورد للإشعار الموجه لتدقيق الأدمن أولاً
router.post(
  '/submit-transfer-to-admin',
  authenticate,
  uploadReceipt.single('receiptFile'),
  FinanceController.submitTransferToAdmin
)

// مسار بديل متوافق مع الواجهة
router.post(
  '/submit-transfer-to-provider',
  authenticate,
  uploadReceipt.single('receiptFile'),
  FinanceController.submitTransferToAdmin
)

// 4. مسارات تدقيق واعتماد الأدمن (Super Admin)
router.get(
  '/admin/pending-transfers',
  authenticate,
  requireRole('SUPER_ADMIN'),
  FinanceController.getAdminPendingTransfers
)

router.post(
  '/admin/transfers/:id/approve',
  authenticate,
  requireRole('SUPER_ADMIN'),
  FinanceController.approveTransferByAdmin
)

router.post(
  '/admin/transfers/:id/reject',
  authenticate,
  requireRole('SUPER_ADMIN'),
  FinanceController.rejectTransferByAdmin
)

router.get(
  '/admin/all-direct-transfers',
  authenticate,
  requireRole('SUPER_ADMIN'),
  FinanceController.getAllDirectTransfers
)

// 5. مسارات مزود الخدمة للتحقق واعتماد أو رفض الحوالات (بعد تدقيق الأدمن)
router.get(
  '/provider/pending-transfers',
  authenticate,
  requireRole('PROVIDER', 'SUPER_ADMIN'),
  FinanceController.getProviderPendingTransfers
)

router.post(
  '/provider/transfers/:id/confirm',
  authenticate,
  requireRole('PROVIDER', 'SUPER_ADMIN'),
  FinanceController.confirmTransferByProvider
)

router.post(
  '/provider/transfers/:id/reject',
  authenticate,
  requireRole('PROVIDER', 'SUPER_ADMIN'),
  FinanceController.rejectTransferByProvider
)

// 6. الحسابات البنكية للمنصة
router.get('/platform-accounts', FinanceController.getPlatformBankAccounts)

export default router
