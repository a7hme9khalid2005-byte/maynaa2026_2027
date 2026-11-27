"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_js_1 = require("./admin.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class AdminController {
    static async getKPIs(_req, res) {
        try {
            const kpis = await admin_service_js_1.AdminService.getDashboardKPIs();
            return (0, response_util_js_1.sendSuccess)(res, kpis, 'تم استرجاع إحصائيات لوحة التحكم');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getConfig(_req, res) {
        try {
            const config = await admin_service_js_1.AdminService.getPlatformConfig();
            return (0, response_util_js_1.sendSuccess)(res, config, 'تم استرجاع إعدادات المنصة');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async updateCommissions(req, res) {
        try {
            const { commissionSea, commissionAir, commissionLand, commissionCustom } = req.body;
            const updated = await admin_service_js_1.AdminService.updateCommissions({
                commissionSea: parseFloat(commissionSea),
                commissionAir: parseFloat(commissionAir),
                commissionLand: parseFloat(commissionLand),
                commissionCustom: parseFloat(commissionCustom),
            });
            return (0, response_util_js_1.sendSuccess)(res, updated, 'تم تحديث نسب العمولات بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async updatePolicy(req, res) {
        try {
            const { termsText, privacyText } = req.body;
            const updated = await admin_service_js_1.AdminService.updatePolicy({ termsText, privacyText });
            return (0, response_util_js_1.sendSuccess)(res, updated, 'تم تحديث نصوص السياسات والشروط بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async search(req, res) {
        try {
            const { q } = req.query;
            const results = await admin_service_js_1.AdminService.globalSearch(q || '');
            return (0, response_util_js_1.sendSuccess)(res, results, 'نتائج البحث السريع');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getUsers(_req, res) {
        try {
            const users = await admin_service_js_1.AdminService.getUsers();
            return (0, response_util_js_1.sendSuccess)(res, users, 'تم استرجاع قائمة المستخدمين من قاعدة البيانات');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await admin_service_js_1.AdminService.updateUserStatus(id, status);
            return (0, response_util_js_1.sendSuccess)(res, updated, 'تم تحديث حالة المستخدم بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await admin_service_js_1.AdminService.deleteUser(id);
            return (0, response_util_js_1.sendSuccess)(res, null, 'تم حذف المستخدم من قاعدة البيانات بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
}
exports.AdminController = AdminController;
