"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const documents_service_js_1 = require("./documents.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class DocumentsController {
    static async uploadDocument(req, res) {
        try {
            const { shipmentId, docType } = req.body;
            if (!req.file) {
                return (0, response_util_js_1.sendError)(res, 'يرجى إرفاق ملف المستند', 400);
            }
            const fileUrl = `/uploads/${req.file.filename}`;
            const doc = await documents_service_js_1.DocumentsService.uploadDocument({
                shipmentId,
                docType: docType || 'OTHER',
                fileName: req.file.originalname,
                fileUrl,
                fileSize: req.file.size,
            });
            return (0, response_util_js_1.sendSuccess)(res, doc, 'تم رفع المستند بنجاح', 201);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getShipmentDocuments(req, res) {
        try {
            const { shipmentId } = req.params;
            const docs = await documents_service_js_1.DocumentsService.getShipmentDocuments(shipmentId);
            return (0, response_util_js_1.sendSuccess)(res, docs, 'تم استرجاع مستندات الشحنة');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
}
exports.DocumentsController = DocumentsController;
