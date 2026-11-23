import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware.js'
import { sendError } from '../utils/response.util.js'

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'يجب تسجيل الدخول أولاً', 401)
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'ليس لديك الصلاحية الكافية للوصول إلى هذا القسم', 403)
    }

    next()
  }
}
