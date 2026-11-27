"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const response_util_js_1 = require("../utils/response.util.js");
const prisma_js_1 = require("../config/prisma.js");
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return (0, response_util_js_1.sendError)(res, 'غير مصرح: يلزم توفير رمز الدخول (Token)', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_ACCESS_SECRET);
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: decoded.id },
            include: { companyProfile: true },
        });
        if (!user || user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
            return (0, response_util_js_1.sendError)(res, 'الحساب غير متاح أو موقوف مؤقتاً', 403);
        }
        req.user = {
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            fullName: user.fullName,
            status: user.status,
            companyName: user.companyProfile?.companyNameAr || '',
            crNumber: user.companyProfile?.crNumber || '',
            companyProfile: user.companyProfile,
        };
        next();
    }
    catch {
        return (0, response_util_js_1.sendError)(res, 'جلسة غير صالحة أو انتهت مدة الرمز', 401);
    }
}
