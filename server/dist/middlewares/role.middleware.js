"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const response_util_js_1 = require("../utils/response.util.js");
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_util_js_1.sendError)(res, 'يجب تسجيل الدخول أولاً', 401);
        }
        const userRole = (req.user.role || '').toUpperCase();
        const allowed = allowedRoles.map((r) => r.toUpperCase());
        if (!allowed.includes(userRole)) {
            return (0, response_util_js_1.sendError)(res, 'ليس لديك الصلاحية الكافية للوصول إلى هذا القسم', 403);
        }
        next();
    };
}
