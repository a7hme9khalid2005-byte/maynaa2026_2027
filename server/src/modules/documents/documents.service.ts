import { prisma } from '../../config/prisma.js'

export class DocumentsService {
  static async uploadDocument(params: {
    shipmentId?: string
    userId?: string
    docType: string
    fileName: string
    fileUrl: string
    fileSize?: number
    status?: string
  }) {
    return prisma.document.create({
      data: {
        shipmentId: params.shipmentId || null,
        userId: params.userId || null,
        docType: params.docType || 'COMMERCIAL_INVOICE',
        fileName: params.fileName,
        fileUrl: params.fileUrl,
        fileSize: params.fileSize,
        status: params.status || 'APPROVED',
      },
    })
  }

  static async getUserDocuments(userId: string) {
    return prisma.document.findMany({
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
    })
  }

  static async getShipmentDocuments(shipmentId: string) {
    return prisma.document.findMany({
      where: { shipmentId },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async deleteDocument(docId: string, userId: string) {
    const doc = await prisma.document.findFirst({
      where: {
        id: docId,
        OR: [
          { userId },
          { shipment: { importerId: userId } },
        ],
      },
    })
    if (!doc) throw new Error('المستند غير موجود أو ليس لديك صلاحية لحذفه')
    return prisma.document.delete({ where: { id: docId } })
  }
}
