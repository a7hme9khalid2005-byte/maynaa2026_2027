import { Request, Response } from 'express'
import { FleetService } from './fleet.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { SocketService } from '../websocket/socket.service.js'

export class FleetController {
  static async getTrucks(req: Request, res: Response) {
    try {
      const { status, truckType } = req.query as { status?: string; truckType?: string }
      const trucks = await FleetService.getTrucks({ status, truckType })
      return sendSuccess(res, trucks, 'تم استرجاع قائمة الشاحنات بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async updateTelemetry(req: Request, res: Response) {
    try {
      const { truckId, latitude, longitude, speed, temperature } = req.body
      const truck = await FleetService.updateTelemetry({
        truckId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speed: parseFloat(speed || '0'),
        temperature: temperature ? parseFloat(temperature) : undefined,
      })

      // بث التحديث عبر الـ WebSockets فوراً لخريطة الأدمن
      SocketService.broadcastLocation({
        truckId: truck.id,
        fleetCode: truck.fleetCode,
        latitude: truck.lastLatitude!,
        longitude: truck.lastLongitude!,
        speed: truck.lastSpeed!,
        temperature: truck.lastTemperature,
      })

      return sendSuccess(res, truck, 'تم تحديث إحداثيات الشاحنة بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async getActiveAlerts(_req: Request, res: Response) {
    try {
      const alerts = await FleetService.getActiveAlerts()
      return sendSuccess(res, alerts, 'تم استرجاع تنبيهات الطوارئ النشطة')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }

  static async resolveAlert(req: Request, res: Response) {
    try {
      const { id } = req.params
      const alert = await FleetService.resolveAlert(id)
      return sendSuccess(res, alert, 'تمت معالجة التنبيه بنجاح')
    } catch (err: any) {
      return sendError(res, err.message)
    }
  }
}
