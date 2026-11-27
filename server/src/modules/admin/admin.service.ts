import { prisma } from '../../config/prisma.js'

export class AdminService {
  // 1. إحصائيات لوحة التحكم العامة (KPIs)
  static async getDashboardKPIs() {
    const totalUsers = await prisma.user.count()
    const totalImporters = await prisma.user.count({ where: { role: 'IMPORTER' } })
    const totalProviders = await prisma.user.count({ where: { role: 'PROVIDER' } })
    const activeTrucks = await prisma.truck.count()
    const totalShipments = await prisma.shipment.count()
    const seaShipments = await prisma.shipment.count({ where: { sector: 'SEA_FREIGHT' } })
    const landShipments = await prisma.shipment.count({ where: { sector: 'LAND_TRANSPORT' } })
    const airShipments = await prisma.shipment.count({ where: { sector: 'AIR_FREIGHT' } })
    const customsShipments = await prisma.shipment.count({ where: { sector: 'CUSTOMS_CLEARANCE' } })
    const pendingTransfers = await prisma.bankTransferTransaction.count({ where: { status: 'SUBMITTED_TO_ADMIN' } })
    const activeAlerts = await prisma.fleetAlert.count({ where: { isResolved: false } })

    const invoices = await prisma.invoice.findMany({
      select: { totalAmount: true, commissionAmount: true, paymentStatus: true },
    })

    const totalRevenue = invoices.reduce((sum, i) => sum + i.totalAmount, 0)
    const totalCommissions = invoices.reduce((sum, i) => sum + i.commissionAmount, 0)
    const totalTradingVolume = totalRevenue

    const recentActivities = await prisma.activityLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    })

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
      recentActivities,
    }
  }

  // 2. إعدادات ونسب العمولات للمنصة
  static async getPlatformConfig() {
    let config = await prisma.platformConfig.findFirst()
    if (!config) {
      config = await prisma.platformConfig.create({
        data: {
          id: 'global-config',
          commissionSea: 2.5,
          commissionAir: 3.0,
          commissionLand: 1.5,
          commissionCustom: 1.0,
          vatPercentage: 15.0,
        },
      })
    }
    return config
  }

  static async updateCommissions(params: {
    commissionSea: number
    commissionAir: number
    commissionLand: number
    commissionCustom: number
  }) {
    return prisma.platformConfig.upsert({
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
    })
  }

  // تحديث سياسات المنصة والشروط وبوابات الربط في قاعدة البيانات
  static async updatePolicy(params: {
    termsText?: string
    privacyText?: string
    emailGatewayEnabled?: boolean
    emailGatewayAddress?: string
    smsGatewayEnabled?: boolean
    smsGatewaySender?: string
    webhookEnabled?: boolean
    webhookUrl?: string
  }) {
    return prisma.platformConfig.upsert({
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
    })
  }

  // 3. محرك البحث الشامل والسريع في المنصة (Global Platform Search)
  static async globalSearch(term: string) {
    const q = term.trim()
    if (!q) return { shipments: [], trucks: [], users: [] }

    const [shipments, trucks, users] = await Promise.all([
      prisma.shipment.findMany({
        where: {
          OR: [
            { trackingNumber: { contains: q } },
            { originName: { contains: q } },
            { destName: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.truck.findMany({
        where: {
          OR: [
            { fleetCode: { contains: q } },
            { plateNumber: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.user.findMany({
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
    ])

    return { shipments, trucks, users }
  }

  // 4. استرجاع كافة المستخدمين المسجلين في المنصة من قاعدة البيانات
  static async getUsers() {
    return prisma.user.findMany({
      include: {
        companyProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 5. تعديل حالة المستخدم (ACTIVE, BLOCKED, SUSPENDED)
  static async updateUserStatus(userId: string, status: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
      include: { companyProfile: true },
    })
  }

  // 6. حذف مستخدم من قاعدة البيانات
  static async deleteUser(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    })
  }

  // 7. تذاكر الدعم والرسائل الموحدة
  static async getSupportTickets(type?: string) {
    const where: any = {}
    if (type && type !== 'all') {
      where.type = type
    }
    return prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  static async updateSupportTicket(id: string, data: { status?: string; reply?: string; agentName?: string }) {
    return prisma.supportTicket.update({
      where: { id },
      data,
    })
  }

  static async createSupportTicket(data: {
    ticketNum?: string
    subject: string
    priority?: string
    status?: string
    clientName?: string
    agentName?: string
    content: string
    type?: string
  }) {
    const ticketCount = await prisma.supportTicket.count()
    const ticketNum = data.ticketNum || `#${1001 + ticketCount}`
    return prisma.supportTicket.create({
      data: {
        ticketNum,
        subject: data.subject,
        priority: data.priority || 'NORMAL',
        status: data.status || 'NEW',
        clientName: data.clientName || 'عميل المنصة',
        agentName: data.agentName || 'فريق الدعم',
        content: data.content,
        type: data.type || 'ticket',
      },
    })
  }

  // 8. سجل الأنشطة الحية
  static async getActivityLogs(limit = 10) {
    return prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  // 9. الفواتير المعتمدة للإدارة
  static async getInvoices(limit = 20) {
    return prisma.invoice.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        shipment: true,
        transfers: true,
      },
    })
  }
}
