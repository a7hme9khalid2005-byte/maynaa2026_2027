import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware.js'
import { sendError } from '../utils/response.util.js'

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'يجب تسجيل الدخول أولاً', 401)
    }

    const userRole = (req.user.role || '').toUpperCase()
    const allowed = allowedRoles.map((r) => r.toUpperCase())

    if (!allowed.includes(userRole)) {
      return sendError(res, 'ليس لديك الصلاحية الكافية للوصول إلى هذا القسم', 403)
    }

    next()
  }
}
