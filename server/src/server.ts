import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app.js'
import { ENV } from './config/env.js'
import { logger } from './utils/logger.util.js'
import { SocketService } from './modules/websocket/socket.service.js'

const server = http.createServer(app)

// إعداد خادم الـ WebSockets
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

SocketService.init(io)

server.listen(ENV.PORT, () => {
  logger.info(`=================================================`)
  logger.info(`🚀 خادم منصة ميناء اللوجستية يعمل بنجاح على المنفذ: ${ENV.PORT}`)
  logger.info(`🌐 فحص صحة الخادم: http://localhost:${ENV.PORT}/api/health`)
  logger.info(`🔌 اتصال الـ WebSockets جاهز ومفعل على المنفذ: ${ENV.PORT}`)
  logger.info(`📁 مجلد المرفقات وإيصالات السداد: ${ENV.UPLOAD_DIR}`)
  logger.info(`=================================================`)
})
