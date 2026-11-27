"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const documents_service_js_1 = require("./documents.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class DocumentsController {
    static async uploadDocument(req, res) {
        try {
            const { shipmentId, docType, status } = req.body;
            const userId = req.user?.id;
            let fileUrl = '/uploads/sample-doc.pdf';
            let fileName = 'مستند_رسمي.pdf';
            let fileSize = 1024 * 1024;
            if (req.file) {
                fileUrl = `/uploads/${req.file.filename}`;
                fileName = req.file.originalname;
                fileSize = req.file.size;
            }
            else if (req.body.fileName) {
                fileName = req.body.fileName;
                fileUrl = req.body.fileUrl || '/uploads/sample-doc.pdf';
            }
            const doc = await documents_service_js_1.DocumentsService.uploadDocument({
                shipmentId: shipmentId || undefined,
                userId,
                docType: docType || 'COMMERCIAL_INVOICE',
                fileName,
                fileUrl,
                fileSize,
                status: status || 'APPROVED',
            });
            return (0, response_util_js_1.sendSuccess)(res, doc, 'تم حفظ المستند بنجاح', 201);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getMyDocuments(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return (0, response_util_js_1.sendError)(res, 'يجب تسجيل الدخول', 401);
            const docs = await documents_service_js_1.DocumentsService.getUserDocuments(userId);
            return (0, response_util_js_1.sendSuccess)(res, docs, 'تم جلب المستندات بنجاح');
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
    static async deleteDocument(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return (0, response_util_js_1.sendError)(res, 'غير مصرح', 401);
            const { id } = req.params;
            await documents_service_js_1.DocumentsService.deleteDocument(id, userId);
            return (0, response_util_js_1.sendSuccess)(res, null, 'تم حذف المستند بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
}
exports.DocumentsController = DocumentsController;
