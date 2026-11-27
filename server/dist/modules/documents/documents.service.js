"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const prisma_js_1 = require("../../config/prisma.js");
class DocumentsService {
    static async uploadDocument(params) {
        return prisma_js_1.prisma.document.create({
            data: {
                shipmentId: params.shipmentId || null,
                userId: params.userId || null,
                docType: params.docType || 'COMMERCIAL_INVOICE',
                fileName: params.fileName,
                fileUrl: params.fileUrl,
                fileSize: params.fileSize,
                status: params.status || 'APPROVED',
            },
        });
    }
    static async getUserDocuments(userId) {
        return prisma_js_1.prisma.document.findMany({
            where: {
                OR: [
                    { userId },
                    { shipment: { importerId: userId } },
                ],
            },
            include: {
                shipment: {
                    select: {
                        id: true,
                        trackingNumber: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getShipmentDocuments(shipmentId) {
        return prisma_js_1.prisma.document.findMany({
            where: { shipmentId },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async deleteDocument(docId, userId) {
        const doc = await prisma_js_1.prisma.document.findFirst({
            where: {
                id: docId,
                OR: [
                    { userId },
                    { shipment: { importerId: userId } },
                ],
            },
        });
        if (!doc)
            throw new Error('المستند غير موجود أو ليس لديك صلاحية لحذفه');
        return prisma_js_1.prisma.document.delete({ where: { id: docId } });
    }
}
exports.DocumentsService = DocumentsService;
