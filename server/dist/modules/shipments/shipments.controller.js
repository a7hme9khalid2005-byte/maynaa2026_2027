"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsController = void 0;
const shipments_service_js_1 = require("./shipments.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class ShipmentsController {
    static async getShipments(req, res) {
        try {
            const { status } = req.query;
            const shipments = await shipments_service_js_1.ShipmentsService.getShipments(req.user, { status });
            return (0, response_util_js_1.sendSuccess)(res, shipments, 'تم استرجاع قائمة الشحنات بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getShipmentById(req, res) {
        try {
            const { id } = req.params;
            const shipment = await shipments_service_js_1.ShipmentsService.getShipmentById(id);
            return (0, response_util_js_1.sendSuccess)(res, shipment, 'تم استرجاع تفاصيل الشحنة');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const shipment = await shipments_service_js_1.ShipmentsService.updateStatus(id, status);
            return (0, response_util_js_1.sendSuccess)(res, shipment, 'تم تحديث حالة الشحنة بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
}
exports.ShipmentsController = ShipmentsController;
