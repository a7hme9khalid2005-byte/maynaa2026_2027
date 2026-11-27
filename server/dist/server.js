"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
const logger_util_js_1 = require("./utils/logger.util.js");
const socket_service_js_1 = require("./modules/websocket/socket.service.js");
const server = http_1.default.createServer(app_js_1.default);
// إعداد خادم الـ WebSockets
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
socket_service_js_1.SocketService.init(io);
server.listen(env_js_1.ENV.PORT, () => {
    logger_util_js_1.logger.info(`=================================================`);
    logger_util_js_1.logger.info(`🚀 خادم منصة ميناء اللوجستية يعمل بنجاح على المنفذ: ${env_js_1.ENV.PORT}`);
    logger_util_js_1.logger.info(`🌐 فحص صحة الخادم: http://localhost:${env_js_1.ENV.PORT}/api/health`);
    logger_util_js_1.logger.info(`🔌 اتصال الـ WebSockets جاهز ومفعل على المنفذ: ${env_js_1.ENV.PORT}`);
    logger_util_js_1.logger.info(`📁 مجلد المرفقات وإيصالات السداد: ${env_js_1.ENV.UPLOAD_DIR}`);
    logger_util_js_1.logger.info(`=================================================`);
});
