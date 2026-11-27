"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const logger_util_js_1 = require("../../utils/logger.util.js");
class SocketService {
    static io = null;
    static init(io) {
        this.io = io;
        this.io.on('connection', (socket) => {
            logger_util_js_1.logger.info(`🔌 عميل متصل بالـ WebSocket: ${socket.id}`);
            socket.on('disconnect', () => {
                logger_util_js_1.logger.info(`🔌 انقطع اتصال العميل: ${socket.id}`);
            });
        });
    }
    // بث إحداثيات الشاحنة لخريطة الأدمن المباشرة
    static broadcastLocation(data) {
        if (this.io) {
            this.io.emit('truck:location_updated', {
                ...data,
                timestamp: new Date().toISOString(),
            });
        }
    }
    // بث تنبيه طارئ فوري
    static broadcastEmergencyAlert(alert) {
        if (this.io) {
            this.io.emit('alert:emergency', {
                ...alert,
                timestamp: new Date().toISOString(),
            });
        }
    }
    // بث اعتماد الحوالة للمستورد
    static broadcastPaymentApproved(invoiceId, shipmentId) {
        if (this.io) {
            this.io.emit('payment:approved', {
                invoiceId,
                shipmentId,
                timestamp: new Date().toISOString(),
            });
        }
    }
}
exports.SocketService = SocketService;
