"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RFQService = void 0;
const prisma_js_1 = require("../../config/prisma.js");
class RFQService {
    // 1. إنشاء طلب تسعير جديد من المستورد
    static async createRFQ(params) {
        const count = await prisma_js_1.prisma.rFQRequest.count();
        const rfqNumber = `RFQ-2026-${String(count + 1).padStart(4, '0')}`;
        return prisma_js_1.prisma.rFQRequest.create({
            data: {
                rfqNumber,
                importerId: params.importerId,
                sector: params.sector,
                originCity: params.originCity,
                destinationCity: params.destinationCity,
                cargoDetails: params.cargoDetails,
                budgetMax: params.budgetMax,
                status: 'OPEN',
            },
        });
    }
    // 2. استعراض الطلبات المفتوحة لمزودي الخدمة
    static async getOpenMarketRFQs() {
        return prisma_js_1.prisma.rFQRequest.findMany({
            where: { status: 'OPEN' },
            include: {
                importer: {
                    select: { id: true, fullName: true, companyProfile: true },
                },
                _count: {
                    select: { quotes: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // 2.1 استعراض طلبات التسعير الخاصة بالمستورد المسجل
    static async getMyRFQs(importerId) {
        return prisma_js_1.prisma.rFQRequest.findMany({
            where: { importerId },
            include: {
                quotes: {
                    include: {
                        provider: {
                            select: { id: true, fullName: true, companyProfile: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // 3. تقديم مزود الخدمة لعرض سعر منافس
    static async submitQuote(params) {
        const taxAmount = params.price * 0.15;
        const totalAmount = params.price + taxAmount;
        return prisma_js_1.prisma.quote.create({
            data: {
                rfqId: params.rfqId,
                providerId: params.providerId,
                price: params.price,
                taxAmount,
                totalAmount,
                transitDays: params.transitDays,
                notes: params.notes,
            },
        });
    }
    // 4. قبول العرض من قبل المستورد -> تحويله لشحنة وتوليد الفاتورة
    static async acceptQuote(quoteId, importerId) {
        const quote = await prisma_js_1.prisma.quote.findUnique({
            where: { id: quoteId },
            include: { rfq: true, provider: true },
        });
        if (!quote)
            throw new Error('العرض غير موجود');
        if (quote.rfq.importerId !== importerId) {
            throw new Error('غير مصرح لك بقبول هذا العرض');
        }
        // 1. تحديد العرض كمقبول
        await prisma_js_1.prisma.quote.update({
            where: { id: quoteId },
            data: { isAccepted: true },
        });
        // 2. إغلاق الـ RFQ
        await prisma_js_1.prisma.rFQRequest.update({
            where: { id: quote.rfqId },
            data: { status: 'AWARDED' },
        });
        // 3. جلب نسبة عمولة المنصة حسب قطاع الشحن
        const config = (await prisma_js_1.prisma.platformConfig.findFirst()) || {
            commissionSea: 2.5,
            commissionAir: 3.0,
            commissionLand: 1.5,
            commissionCustom: 1.0,
        };
        let rate = 2.0;
        if (quote.rfq.sector === 'SEA_FREIGHT')
            rate = config.commissionSea;
        else if (quote.rfq.sector === 'AIR_FREIGHT')
            rate = config.commissionAir;
        else if (quote.rfq.sector === 'LAND_TRANSPORT')
            rate = config.commissionLand;
        else if (quote.rfq.sector === 'CUSTOMS_CLEARANCE')
            rate = config.commissionCustom;
        const commissionAmount = (quote.price * rate) / 100;
        const providerPayoutNet = quote.totalAmount - commissionAmount;
        // 4. توليد رقم الشحنة ورقم الفاتورة
        const shipmentCount = await prisma_js_1.prisma.shipment.count();
        const trackingNumber = `SHN-2026-${String(shipmentCount + 101).padStart(3, '0')}`;
        const invoiceNumber = `INV-2026-${String(shipmentCount + 1).padStart(4, '0')}`;
        // 5. إنشاء الشحنة
        const shipment = await prisma_js_1.prisma.shipment.create({
            data: {
                trackingNumber,
                quoteId: quote.id,
                importerId,
                providerId: quote.providerId,
                sector: quote.rfq.sector,
                originName: quote.rfq.originCity,
                destName: quote.rfq.destinationCity,
                status: 'PENDING_PAYMENT',
            },
        });
        // 6. إنشاء الفاتورة بانتظار التحويل البنكي الخارجي
        const invoice = await prisma_js_1.prisma.invoice.create({
            data: {
                invoiceNumber,
                shipmentId: shipment.id,
                subtotal: quote.price,
                taxAmount: quote.taxAmount,
                totalAmount: quote.totalAmount,
                commissionRate: rate,
                commissionAmount,
                providerPayoutNet,
                paymentStatus: 'UNPAID',
            },
        });
        return {
            message: 'تم قبول العرض وإنشاء الشحنة وتوليد الفاتورة بنجاح',
            shipment,
            invoice,
        };
    }
}
exports.RFQService = RFQService;
