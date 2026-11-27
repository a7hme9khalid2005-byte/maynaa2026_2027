"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const finance_service_js_1 = require("./finance.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
const socket_service_js_1 = require("../websocket/socket.service.js");
class FinanceController {
    // 1. فحص حالة الفترة التجريبية (3 أيام مجانية) ونسبة العمولة
    static async getUserTrialStatus(req, res) {
        try {
            if (!req.user) {
                return (0, response_util_js_1.sendError)(res, 'يجب تسجيل الدخول', 401);
            }
            const trial = await finance_service_js_1.FinanceService.getUserTrialStatus(req.user.id);
            return (0, response_util_js_1.sendSuccess)(res, trial, 'تم جلب حالة الفترة التجريبية ونسبة العمولة بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 2. استرجاع بيانات الحساب البنكي لمزود الخدمة الخاص بالشحنة
    static async getProviderBankDetails(req, res) {
        try {
            const { shipmentId } = req.params;
            const details = await finance_service_js_1.FinanceService.getProviderBankDetails(shipmentId);
            return (0, response_util_js_1.sendSuccess)(res, details, 'تم استرجاع الحساب البنكي لمزود الخدمة بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 3. رفع المستورد للإشعار الموجه لتدقيق الأدمن أولاً
    static async submitTransferToAdmin(req, res) {
        try {
            const { invoiceId, currency, subtotalAmount, senderBankName, senderAccountName, transferRefNumber, transferAmount, transferDate, } = req.body;
            let receiptFileUrl = '/uploads/sample-receipt.png';
            if (req.file) {
                receiptFileUrl = `/uploads/${req.file.filename}`;
            }
            if (!req.user) {
                return (0, response_util_js_1.sendError)(res, 'يجب تسجيل الدخول', 401);
            }
            const result = await finance_service_js_1.FinanceService.submitTransferToAdmin({
                invoiceId,
                payerId: req.user.id,
                currency: currency || 'USD',
                subtotalAmount: subtotalAmount ? parseFloat(subtotalAmount) : undefined,
                senderBankName,
                senderAccountName,
                transferRefNumber,
                transferAmount: transferAmount ? parseFloat(transferAmount) : undefined,
                transferDate: new Date(transferDate || Date.now()),
                receiptFileUrl,
            });
            // إشعار الأدمن عبر Socket.io
            socket_service_js_1.SocketService.broadcastPaymentApproved(invoiceId, 'NEW_TRANSFER_SUBMITTED_TO_ADMIN');
            return (0, response_util_js_1.sendSuccess)(res, result, 'تم إرسال إشعار التحويل البنكي إلى الإدارة بنجاح للتدقيق قبل اعتماده لمزود الخدمة', 201);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 4. استرجاع الحوالات المعلقة لتدقيق الأدمن
    static async getAdminPendingTransfers(_req, res) {
        try {
            const transfers = await finance_service_js_1.FinanceService.getAdminPendingTransfers();
            return (0, response_util_js_1.sendSuccess)(res, transfers, 'تم استرجاع الحوالات المعلقة لتدقيق الإدارة');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 5. موافقة الأدمن على الإشعار وتمريره لمزود الخدمة
    static async approveTransferByAdmin(req, res) {
        try {
            const { id } = req.params;
            const { notes } = req.body;
            const adminId = req.user.id;
            const result = await finance_service_js_1.FinanceService.approveTransferByAdmin(id, adminId, notes);
            // إشعار المزود عبر Socket.io بوصول إشعار مدقق من الإدارة
            socket_service_js_1.SocketService.broadcastPaymentApproved(id, 'TRANSFER_APPROVED_BY_ADMIN');
            return (0, response_util_js_1.sendSuccess)(res, result, result.message);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 6. رفض الأدمن للإشعار
    static async rejectTransferByAdmin(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const adminId = req.user.id;
            const result = await finance_service_js_1.FinanceService.rejectTransferByAdmin(id, adminId, reason || 'الإشعار غير واضح أو لم يتم تضمين العمولة المطلوبة');
            return (0, response_util_js_1.sendSuccess)(res, result, result.message);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 7. استرجاع الحوالات المعلقة لمزود الخدمة (فقط المعتمدة من الأدمن)
    static async getProviderPendingTransfers(req, res) {
        try {
            const providerId = req.user.id;
            const transfers = await finance_service_js_1.FinanceService.getProviderPendingTransfers(providerId);
            return (0, response_util_js_1.sendSuccess)(res, transfers, 'تم استرجاع الحوالات المعتمدة إدارياً بانتظار تأكيدك');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 8. تأكيد واعتماد المزود للحوالة في حسابه البنكي ⬅️ تفعيل الشحنة
    static async confirmTransferByProvider(req, res) {
        try {
            const { id } = req.params;
            const providerId = req.user.id;
            const result = await finance_service_js_1.FinanceService.confirmTransferByProvider(id, providerId);
            // بث إشعار WebSocket بتفعيل الشحنة
            socket_service_js_1.SocketService.broadcastPaymentApproved(id, 'SHIPMENT_ACTIVATED_READY_FOR_PICKUP');
            return (0, response_util_js_1.sendSuccess)(res, result, 'تم تأكيد استلام الحوالة في الحساب البنكي وتفعيل الشحنة بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 9. رفض المزود للإشعار لعدم وصول الحوالة
    static async rejectTransferByProvider(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const providerId = req.user.id;
            const result = await finance_service_js_1.FinanceService.rejectTransferByProvider(id, providerId, reason || 'الحوالة لم تظهر في حسابنا البنكي الفعلي');
            return (0, response_util_js_1.sendSuccess)(res, result, 'تم تسجيل الرفض وإشعار الإدارة والمستورد');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 10. استرجاع الحسابات البنكية للمنصة
    static async getPlatformBankAccounts(_req, res) {
        try {
            const accounts = await finance_service_js_1.FinanceService.getPlatformBankAccounts();
            return (0, response_util_js_1.sendSuccess)(res, accounts, 'تم استرجاع الحسابات البنكية المعتمدة');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    // 11. استرجاع كافة الحوالات للأدمن
    static async getAllDirectTransfers(_req, res) {
        try {
            const transfers = await finance_service_js_1.FinanceService.getAllDirectTransfers();
            return (0, response_util_js_1.sendSuccess)(res, transfers, 'تم استرجاع كافة الحوالات');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
}
exports.FinanceController = FinanceController;
