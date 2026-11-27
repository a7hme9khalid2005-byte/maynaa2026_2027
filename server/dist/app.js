"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const env_js_1 = require("./config/env.js");
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
// استيراد الـ Routes
const auth_routes_js_1 = __importDefault(require("./modules/auth/auth.routes.js"));
const finance_routes_js_1 = __importDefault(require("./modules/finance/finance.routes.js"));
const fleet_routes_js_1 = __importDefault(require("./modules/fleet/fleet.routes.js"));
const rfq_routes_js_1 = __importDefault(require("./modules/rfq/rfq.routes.js"));
const shipments_routes_js_1 = __importDefault(require("./modules/shipments/shipments.routes.js"));
const documents_routes_js_1 = __importDefault(require("./modules/documents/documents.routes.js"));
const admin_routes_js_1 = __importDefault(require("./modules/admin/admin.routes.js"));
const app = (0, express_1.default)();
// 1. حماية وتأمين الرؤوس (Security Headers)
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// 2. ضبط الـ CORS مع واجهة المستخدم
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
// 3. محدد معدل الطلبات (Rate Limiting) لمنع الهجمات
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { success: false, message: 'تجاوزت الحد المسموح من الطلبات، يرجى المحاولة لاحقاً' },
});
app.use(limiter);
// 4. معالجة الـ JSON والـ URL-Encoded
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 5. مجلد الملفات والمرفقات الثابتة (إيصالات البنوك والمستندات)
const uploadsPath = path_1.default.resolve(process.cwd(), env_js_1.ENV.UPLOAD_DIR);
app.use('/uploads', express_1.default.static(uploadsPath));
// 6. فحص صحة الخادم (Health Check)
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'online',
        platform: 'Meynaa Smart Logistics API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// 7. تسجيل المسارات (API Routes v1)
app.use('/api/v1/auth', auth_routes_js_1.default);
app.use('/api/v1/finance', finance_routes_js_1.default);
app.use('/api/v1/fleet', fleet_routes_js_1.default);
app.use('/api/v1/rfq', rfq_routes_js_1.default);
app.use('/api/v1/shipments', shipments_routes_js_1.default);
app.use('/api/v1/documents', documents_routes_js_1.default);
app.use('/api/v1/admin', admin_routes_js_1.default);
// 8. معالج الأخطاء المركزي
app.use(error_middleware_js_1.errorHandler);
exports.default = app;
