import { prisma } from '../../config/prisma.js'

export class FleetService {
  // 1. استرجاع قائمة الشاحنات مع الإحداثيات المباشرة للخريطة
  static async getTrucks(filters?: { status?: string; truckType?: string }) {
    return prisma.truck.findMany({
      where: {
        status: filters?.status ? filters.status : undefined,
        truckType: filters?.truckType ? filters.truckType : undefined,
      },
      include: {
        driver: {
          select: { id: true, fullName: true, phone: true },
        },
        provider: {
          select: { id: true, fullName: true },
        },
        alerts: {
          where: { isResolved: false },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 2. تحديث الإحداثيات اللحظية للشاحنة من قبل السائق أو جهاز التتبع
  static async updateTelemetry(params: {
    truckId: string
    latitude: number
    longitude: number
    speed: number
    temperature?: number
  }) {
    const truck = await prisma.truck.update({
      where: { id: params.truckId },
      data: {
        lastLatitude: params.latitude,
        lastLongitude: params.longitude,
        lastSpeed: params.speed,
        lastTemperature: params.temperature,
        lastTelemetryAt: new Date(),
      },
    })

    // فحص الحرارة التلقائي (إذا كانت مبردة وتجاوزت 4 درجات مئوية مثلاً)
    if (params.temperature && params.temperature > 4.0) {
      await prisma.fleetAlert.create({
        data: {
          truckId: params.truckId,
          alertType: 'HIGH_TEMP',
          severity: 'HIGH',
          title: 'ارتفاع حرارة الشاحنة المبردة',
          description: `تجاوزت درجة الحرارة الحد المسموح: ${params.temperature}°C`,
          latitude: params.latitude,
          longitude: params.longitude,
        },
      })
    }

    return truck
  }

  // 3. استرجاع جميع تنبيهات الطوارئ النشطة
  static async getActiveAlerts() {
    return prisma.fleetAlert.findMany({
      where: { isResolved: false },
      include: {
        truck: {
          select: {
            id: true,
            fleetCode: true,
            plateNumber: true,
            lastLatitude: true,
            lastLongitude: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 4. إغلاق أو معالجة التنبيه
  static async resolveAlert(alertId: string) {
    return prisma.fleetAlert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    })
  }
}
