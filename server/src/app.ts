import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { ENV } from './config/env.js'
import { errorHandler } from './middlewares/error.middleware.js'

// استيراد الـ Routes
import authRoutes from './modules/auth/auth.routes.js'
import financeRoutes from './modules/finance/finance.routes.js'
import fleetRoutes from './modules/fleet/fleet.routes.js'
import rfqRoutes from './modules/rfq/rfq.routes.js'
import shipmentRoutes from './modules/shipments/shipments.routes.js'
import documentRoutes from './modules/documents/documents.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'

const app = express()

// 1. حماية وتأمين الرؤوس (Security Headers)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// 2. ضبط الـ CORS مع واجهة المستخدم
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)

// 3. محدد معدل الطلبات (Rate Limiting) لمنع الهجمات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'تجاوزت الحد المسموح من الطلبات، يرجى المحاولة لاحقاً' },
})
app.use(limiter)

// 4. معالجة الـ JSON والـ URL-Encoded
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 5. مجلد الملفات والمرفقات الثابتة (إيصالات البنوك والمستندات)
const uploadsPath = path.resolve(process.cwd(), ENV.UPLOAD_DIR)
app.use('/uploads', express.static(uploadsPath))

// 6. فحص صحة الخادم (Health Check)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'Meynaa Smart Logistics API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// 7. تسجيل المسارات (API Routes v1)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/finance', financeRoutes)
app.use('/api/v1/fleet', fleetRoutes)
app.use('/api/v1/rfq', rfqRoutes)
app.use('/api/v1/shipments', shipmentRoutes)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1/admin', adminRoutes)

// 8. معالج الأخطاء المركزي
app.use(errorHandler)

export default app
