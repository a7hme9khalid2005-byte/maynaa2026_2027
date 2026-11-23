import { prisma } from '../../config/prisma.js'

export class DocumentsService {
  static async uploadDocument(params: {
    shipmentId: string
    docType: string
    fileName: string
    fileUrl: string
    fileSize?: number
  }) {
    return prisma.document.create({
      data: {
        shipmentId: params.shipmentId,
        docType: params.docType,
        fileName: params.fileName,
        fileUrl: params.fileUrl,
        fileSize: params.fileSize,
      },
    })
  }

  static async getShipmentDocuments(shipmentId: string) {
    return prisma.document.findMany({
      where: { shipmentId },
      orderBy: { createdAt: 'desc' },
    })
  }
}
