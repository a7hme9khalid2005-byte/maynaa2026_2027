"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RFQController = void 0;
const rfq_service_js_1 = require("./rfq.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class RFQController {
    static async createRFQ(req, res) {
        try {
            const { sector, originCity, destinationCity, cargoDetails, budgetMax } = req.body;
            const rfq = await rfq_service_js_1.RFQService.createRFQ({
                importerId: req.user.id,
                sector,
                originCity,
                destinationCity,
                cargoDetails: typeof cargoDetails === 'object' ? JSON.stringify(cargoDetails) : cargoDetails,
                budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
            });
            return (0, response_util_js_1.sendSuccess)(res, rfq, 'تم إنشاء طلب التسعير بنجاح', 201);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getOpenMarketRFQs(_req, res) {
        try {
            const rfqs = await rfq_service_js_1.RFQService.getOpenMarketRFQs();
            return (0, response_util_js_1.sendSuccess)(res, rfqs, 'تم استرجاع طلبات التسعير المتاحة في السوق');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getMyRFQs(req, res) {
        try {
            const rfqs = await rfq_service_js_1.RFQService.getMyRFQs(req.user.id);
            return (0, response_util_js_1.sendSuccess)(res, rfqs, 'تم استرجاع طلبات التسعير الخاصة بك بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async submitQuote(req, res) {
        try {
            const { rfqId, price, transitDays, notes } = req.body;
            const quote = await rfq_service_js_1.RFQService.submitQuote({
                rfqId,
                providerId: req.user.id,
                price: parseFloat(price),
                transitDays: parseInt(transitDays, 10),
                notes,
            });
            return (0, response_util_js_1.sendSuccess)(res, quote, 'تم تقديم عرض السعر بنجاح', 201);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async acceptQuote(req, res) {
        try {
            const { id } = req.params;
            const result = await rfq_service_js_1.RFQService.acceptQuote(id, req.user.id);
            return (0, response_util_js_1.sendSuccess)(res, result, 'تم اعتماد العرض وإنشاء الشحنة');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
}
exports.RFQController = RFQController;
