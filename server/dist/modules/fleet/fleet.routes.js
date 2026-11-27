"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fleet_controller_js_1 = require("./fleet.controller.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../../middlewares/role.middleware.js");
const router = (0, express_1.Router)();
// استرجاع الشاحنات للخريطة
router.get('/trucks', auth_middleware_js_1.authenticate, fleet_controller_js_1.FleetController.getTrucks);
// إرسال الإحداثيات اللحظية (تطبيق السائق أو أجهزة التتبع)
router.post('/telemetry', auth_middleware_js_1.authenticate, fleet_controller_js_1.FleetController.updateTelemetry);
// التنبيهات وإغلاقها
router.get('/alerts', auth_middleware_js_1.authenticate, fleet_controller_js_1.FleetController.getActiveAlerts);
router.patch('/alerts/:id/resolve', auth_middleware_js_1.authenticate, (0, role_middleware_js_1.requireRole)('SUPER_ADMIN'), fleet_controller_js_1.FleetController.resolveAlert);
exports.default = router;
