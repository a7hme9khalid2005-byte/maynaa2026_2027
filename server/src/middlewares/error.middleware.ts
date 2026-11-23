import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.util.js'
import { sendError } from '../utils/response.util.js'

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error('Unhandled Server Error:', err)

  if (err instanceof Error && err.name === 'MulterError') {
    return sendError(res, `خطأ في رفع الملف: ${err.message}`, 400)
  }

  const statusCode = err.status || err.statusCode || 500
  const message = err.message || 'حدث خطأ داخلي في الخادم'

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined)
}
