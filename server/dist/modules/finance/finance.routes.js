"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const finance_controller_js_1 = require("./finance.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../../middlewares/role.middleware.js");
const upload_middleware_js_1 = require("../../middlewares/upload.middleware.js");
const router = (0, express_1.Router)();
// 1. فحص حالة الـ 3 أيام المجانية ونسبة العمولة للمستخدم
router.get('/trial-status', auth_middleware_js_1.authenticate, finance_controller_js_1.FinanceController.getUserTrialStatus);
router.get('/my-transfers', auth_middleware_js_1.authenticate, finance_controller_js_1.FinanceController.getMyTransfers);
router.get('/transfers/my', auth_middleware_js_1.authenticate, finance_controller_js_1.FinanceController.getMyTransfers);
// 2. جلب بيانات بنك المزود الخاص بالشحنة (التحويل البنكي الخارجي)
router.get('/provider-bank/:shipmentId', auth_middleware_js_1.authenticate, finance_controller_js_1.FinanceController.getProviderBankDetails);
// 3. رفع المستورد للإشعار الموجه لتدقيق الأدمن أولاً
router.post('/submit-transfer-to-admin', auth_middleware_js_1.authenticate, upload_middleware_js_1.uploadReceipt.single('receiptFile'), finance_controller_js_1.FinanceController.submitTransferToAdmin);
// مسار بديل متوافق مع الواجهة
router.post('/submit-transfer-to-provider', auth_middleware_js_1.authenticate, upload_middleware_js_1.uploadReceipt.single('receiptFile'), finance_controller_js_1.FinanceController.submitTransferToAdmin);
// 4. مسارات تدقيق واعتماد الأدمن (Super Admin & Admin)
router.get('/admin/pending-transfers', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('SUPER_ADMIN', 'ADMIN'), finance_controller_js_1.FinanceController.getAdminPendingTransfers);
router.post('/admin/transfers/:id/approve', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('SUPER_ADMIN', 'ADMIN'), finance_controller_js_1.FinanceController.approveTransferByAdmin);
router.post('/admin/transfers/:id/reject', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('SUPER_ADMIN', 'ADMIN'), finance_controller_js_1.FinanceController.rejectTransferByAdmin);
router.get('/admin/all-direct-transfers', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('SUPER_ADMIN', 'ADMIN'), finance_controller_js_1.FinanceController.getAllDirectTransfers);
// 5. مسارات مزود الخدمة للتحقق واعتماد أو رفض الحوالات (بعد تدقيق الأدمن)
router.get('/provider/pending-transfers', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('PROVIDER', 'SUPER_ADMIN'), finance_controller_js_1.FinanceController.getProviderPendingTransfers);
router.post('/provider/transfers/:id/confirm', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('PROVIDER', 'SUPER_ADMIN'), finance_controller_js_1.FinanceController.confirmTransferByProvider);
router.post('/provider/transfers/:id/reject', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('PROVIDER', 'SUPER_ADMIN'), finance_controller_js_1.FinanceController.rejectTransferByProvider);
// 6. الحسابات البنكية للمنصة
router.get('/platform-accounts', finance_controller_js_1.FinanceController.getPlatformBankAccounts);
exports.default = router;
