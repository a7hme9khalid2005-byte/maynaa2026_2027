import { prisma } from '../../config/prisma.js'

export class ShipmentsService {
  static async getShipments(user: { id: string; role: string }, filters?: { status?: string }) {
    const where: any = {}

    if (user.role === 'IMPORTER') {
      where.importerId = user.id
    } else if (user.role === 'PROVIDER') {
      where.providerId = user.id
    }

    if (filters?.status) {
      where.status = filters.status
    }

    return prisma.shipment.findMany({
      where,
      include: {
        importer: { select: { id: true, fullName: true, phone: true } },
        provider: { select: { id: true, fullName: true, phone: true } },
        truck: { select: { id: true, fleetCode: true, plateNumber: true, lastSpeed: true, lastTemperature: true } },
        invoice: { select: { id: true, invoiceNumber: true, totalAmount: true, paymentStatus: true } },
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getShipmentById(id: string) {
    const shipment = await prisma.shipment.findUnique({
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
    })

    if (!shipment) throw new Error('الشحنة غير موجودة')
    return shipment
  }

  static async updateStatus(shipmentId: string, status: string) {
    return prisma.shipment.update({
      where: { id: shipmentId },
      data: { status },
    })
  }
}
