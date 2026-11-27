"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_js_1 = require("../../config/prisma.js");
class AdminService {
    // 1. إحصائيات لوحة التحكم العامة (KPIs)
    static async getDashboardKPIs() {
        const totalUsers = await prisma_js_1.prisma.user.count();
        const totalImporters = await prisma_js_1.prisma.user.count({ where: { role: 'IMPORTER' } });
        const totalProviders = await prisma_js_1.prisma.user.count({ where: { role: 'PROVIDER' } });
        const activeTrucks = await prisma_js_1.prisma.truck.count();
        const totalShipments = await prisma_js_1.prisma.shipment.count();
        const seaShipments = await prisma_js_1.prisma.shipment.count({ where: { sector: 'SEA_FREIGHT' } });
        const landShipments = await prisma_js_1.prisma.shipment.count({ where: { sector: 'LAND_TRANSPORT' } });
        const airShipments = await prisma_js_1.prisma.shipment.count({ where: { sector: 'AIR_FREIGHT' } });
        const customsShipments = await prisma_js_1.prisma.shipment.count({ where: { sector: 'CUSTOMS_CLEARANCE' } });
        const pendingTransfers = await prisma_js_1.prisma.bankTransferTransaction.count({ where: { status: 'SUBMITTED_TO_ADMIN' } });
        const activeAlerts = await prisma_js_1.prisma.fleetAlert.count({ where: { isResolved: false } });
        const invoices = await prisma_js_1.prisma.invoice.findMany({
            select: { totalAmount: true, commissionAmount: true, paymentStatus: true },
        });
        const totalRevenue = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
        const totalCommissions = invoices.reduce((sum, i) => sum + i.commissionAmount, 0);
        const totalTradingVolume = totalRevenue;
        return {
            totalUsers,
            totalImporters,
            totalProviders,
            activeTrucks,
            totalShipments,
            seaShipments,
            landShipments,
            airShipments,
            customsShipments,
            pendingTransfers,
            activeAlerts,
            totalRevenue,
            totalCommissions,
            totalTradingVolume,
        };
    }
    // 2. إعدادات ونسب العمولات للمنصة
    static async getPlatformConfig() {
        let config = await prisma_js_1.prisma.platformConfig.findFirst();
        if (!config) {
            config = await prisma_js_1.prisma.platformConfig.create({
                data: {
                    id: 'global-config',
                    commissionSea: 2.5,
                    commissionAir: 3.0,
                    commissionLand: 1.5,
                    commissionCustom: 1.0,
                    vatPercentage: 15.0,
                },
            });
        }
        return config;
    }
    static async updateCommissions(params) {
        return prisma_js_1.prisma.platformConfig.upsert({
            where: { id: 'global-config' },
            update: {
                commissionSea: params.commissionSea,
                commissionAir: params.commissionAir,
                commissionLand: params.commissionLand,
                commissionCustom: params.commissionCustom,
            },
            create: {
                id: 'global-config',
                commissionSea: params.commissionSea,
                commissionAir: params.commissionAir,
                commissionLand: params.commissionLand,
                commissionCustom: params.commissionCustom,
            },
        });
    }
    // تحديث سياسات المنصة والشروط في قاعدة البيانات
    static async updatePolicy(params) {
        return prisma_js_1.prisma.platformConfig.upsert({
            where: { id: 'global-config' },
            update: params,
            create: {
                id: 'global-config',
                commissionSea: 2.5,
                commissionAir: 3.0,
                commissionLand: 1.5,
                commissionCustom: 1.0,
                vatPercentage: 15.0,
                ...params,
            },
        });
    }
    // 3. محرك البحث الشامل والسريع في المنصة (Global Platform Search)
    static async globalSearch(term) {
        const q = term.trim();
        if (!q)
            return { shipments: [], trucks: [], users: [] };
        const [shipments, trucks, users] = await Promise.all([
            prisma_js_1.prisma.shipment.findMany({
                where: {
                    OR: [
                        { trackingNumber: { contains: q } },
                        { originName: { contains: q } },
                        { destName: { contains: q } },
                    ],
                },
                take: 5,
            }),
            prisma_js_1.prisma.truck.findMany({
                where: {
                    OR: [
                        { fleetCode: { contains: q } },
                        { plateNumber: { contains: q } },
                    ],
                },
                take: 5,
            }),
            prisma_js_1.prisma.user.findMany({
                where: {
                    OR: [
                        { fullName: { contains: q } },
                        { email: { contains: q } },
                        { phone: { contains: q } },
                    ],
                },
                select: { id: true, fullName: true, email: true, phone: true, role: true },
                take: 5,
            }),
        ]);
        return { shipments, trucks, users };
    }
    // 4. استرجاع كافة المستخدمين المسجلين في المنصة من قاعدة البيانات
    static async getUsers() {
        return prisma_js_1.prisma.user.findMany({
            include: {
                companyProfile: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // 5. تعديل حالة المستخدم (ACTIVE, BLOCKED, SUSPENDED)
    static async updateUserStatus(userId, status) {
        return prisma_js_1.prisma.user.update({
            where: { id: userId },
            data: { status: status },
            include: { companyProfile: true },
        });
    }
    // 6. حذف مستخدم من قاعدة البيانات
    static async deleteUser(userId) {
        return prisma_js_1.prisma.user.delete({
            where: { id: userId },
        });
    }
}
exports.AdminService = AdminService;
