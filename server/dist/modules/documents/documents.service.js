"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const prisma_js_1 = require("../../config/prisma.js");
class DocumentsService {
    static async uploadDocument(params) {
        return prisma_js_1.prisma.document.create({
            data: {
                shipmentId: params.shipmentId,
                docType: params.docType,
                fileName: params.fileName,
                fileUrl: params.fileUrl,
                fileSize: params.fileSize,
            },
        });
    }
    static async getShipmentDocuments(shipmentId) {
        return prisma_js_1.prisma.document.findMany({
            where: { shipmentId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.DocumentsService = DocumentsService;
