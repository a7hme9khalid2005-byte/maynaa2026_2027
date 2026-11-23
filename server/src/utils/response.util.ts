import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any
  meta?: Record<string, any>
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message = 'تمت العملية بنجاح',
  statusCode = 200,
  meta?: Record<string, any>
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  })
}

export function sendError(
  res: Response,
  message = 'حدث خطأ أثناء معالجة الطلب',
  statusCode = 400,
  errors?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  })
}
