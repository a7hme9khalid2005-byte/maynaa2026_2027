import { Server as SocketIOServer } from 'socket.io'
import { logger } from '../../utils/logger.util.js'

export class SocketService {
  private static io: SocketIOServer | null = null

  static init(io: SocketIOServer) {
    this.io = io

    this.io.on('connection', (socket) => {
      logger.info(`🔌 عميل متصل بالـ WebSocket: ${socket.id}`)

      socket.on('disconnect', () => {
        logger.info(`🔌 انقطع اتصال العميل: ${socket.id}`)
      })
    })
  }

  // بث إحداثيات الشاحنة لخريطة الأدمن المباشرة
  static broadcastLocation(data: {
    truckId: string
    fleetCode: string
    latitude: number
    longitude: number
    speed: number
    temperature?: number | null
  }) {
    if (this.io) {
      this.io.emit('truck:location_updated', {
        ...data,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // بث تنبيه طارئ فوري
  static broadcastEmergencyAlert(alert: {
    alertId: string
    truckId: string
    alertType: string
    severity: string
    title: string
    description: string
    latitude?: number | null
    longitude?: number | null
  }) {
    if (this.io) {
      this.io.emit('alert:emergency', {
        ...alert,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // بث اعتماد الحوالة للمستورد
  static broadcastPaymentApproved(invoiceId: string, shipmentId: string) {
    if (this.io) {
      this.io.emit('payment:approved', {
        invoiceId,
        shipmentId,
        timestamp: new Date().toISOString(),
      })
    }
  }
}
