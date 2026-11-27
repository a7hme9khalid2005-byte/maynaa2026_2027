"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsService = void 0;
const prisma_js_1 = require("../../config/prisma.js");
class ShipmentsService {
    static async getShipments(user, filters) {
        const where = {};
        if (user.role === 'IMPORTER') {
            where.importerId = user.id;
        }
        else if (user.role === 'PROVIDER') {
            where.providerId = user.id;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        return prisma_js_1.prisma.shipment.findMany({
            where,
            include: {
                importer: { select: { id: true, fullName: true, phone: true } },
                provider: { select: { id: true, fullName: true, phone: true } },
                truck: { select: { id: true, fleetCode: true, plateNumber: true, lastSpeed: true, lastTemperature: true } },
                invoice: { select: { id: true, invoiceNumber: true, totalAmount: true, paymentStatus: true } },
                documents: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getShipmentById(id) {
        const shipment = await prisma_js_1.prisma.shipment.findUnique({
            where: { id },
            include: {
                importer: { select: { id: true, fullName: true, phone: true, email: true } },
                provider: { select: { id: true, fullName: true, phone: true, email: true } },
                truck: true,
                invoice: {
                    include: {
                        transfers: {
                            include: { platformBank: true },
                        },
                    },
                },
                documents: true,
            },
        });
        if (!shipment)
            throw new Error('الشحنة غير موجودة');
        return shipment;
    }
    static async updateStatus(shipmentId, status) {
        return prisma_js_1.prisma.shipment.update({
            where: { id: shipmentId },
            data: { status },
        });
    }
}
exports.ShipmentsService = ShipmentsService;
