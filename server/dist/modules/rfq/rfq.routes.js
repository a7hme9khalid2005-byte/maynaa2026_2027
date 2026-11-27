"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfq_controller_js_1 = require("./rfq.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../../middlewares/role.middleware.js");
const router = (0, express_1.Router)();
// إنشاء طلب تسعير (خاص بالمستورد)
router.post('/', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('IMPORTER', 'SUPER_ADMIN'), rfq_controller_js_1.RFQController.createRFQ);
// استعراض طلبات التسعير الخاصة بالمستورد الحالي
router.get('/my', auth_middleware_js_1.authenticate, rfq_controller_js_1.RFQController.getMyRFQs);
router.get('/', auth_middleware_js_1.authenticate, rfq_controller_js_1.RFQController.getMyRFQs);
// استعراض طلبات السوق (لمزودي الخدمة)
router.get('/market', rfq_controller_js_1.RFQController.getOpenMarketRFQs);
// تقديم عرض سعر (لمزود الخدمة)
router.post('/quote', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('PROVIDER', 'SUPER_ADMIN'), rfq_controller_js_1.RFQController.submitQuote);
// قبول العرض (خاص بالمستورد)
router.post('/quote/:id/accept', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('IMPORTER', 'SUPER_ADMIN'), rfq_controller_js_1.RFQController.acceptQuote);
exports.default = router;
