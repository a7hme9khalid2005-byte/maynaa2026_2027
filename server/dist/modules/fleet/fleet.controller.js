"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetController = void 0;
const fleet_service_js_1 = require("./fleet.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
const socket_service_js_1 = require("../websocket/socket.service.js");
class FleetController {
    static async getTrucks(req, res) {
        try {
            const { status, truckType } = req.query;
            const trucks = await fleet_service_js_1.FleetService.getTrucks({ status, truckType });
            return (0, response_util_js_1.sendSuccess)(res, trucks, 'تم استرجاع قائمة الشاحنات بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async updateTelemetry(req, res) {
        try {
            const { truckId, latitude, longitude, speed, temperature } = req.body;
            const truck = await fleet_service_js_1.FleetService.updateTelemetry({
                truckId,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                speed: parseFloat(speed || '0'),
                temperature: temperature ? parseFloat(temperature) : undefined,
            });
            // بث التحديث عبر الـ WebSockets فوراً لخريطة الأدمن
            socket_service_js_1.SocketService.broadcastLocation({
                truckId: truck.id,
                fleetCode: truck.fleetCode,
                latitude: truck.lastLatitude,
                longitude: truck.lastLongitude,
                speed: truck.lastSpeed,
                temperature: truck.lastTemperature,
            });
            return (0, response_util_js_1.sendSuccess)(res, truck, 'تم تحديث إحداثيات الشاحنة بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async getActiveAlerts(_req, res) {
        try {
            const alerts = await fleet_service_js_1.FleetService.getActiveAlerts();
            return (0, response_util_js_1.sendSuccess)(res, alerts, 'تم استرجاع تنبيهات الطوارئ النشطة');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
    static async resolveAlert(req, res) {
        try {
            const { id } = req.params;
            const alert = await fleet_service_js_1.FleetService.resolveAlert(id);
            return (0, response_util_js_1.sendSuccess)(res, alert, 'تمت معالجة التنبيه بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message);
        }
    }
}
exports.FleetController = FleetController;
