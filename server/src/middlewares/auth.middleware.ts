import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'
import { sendError } from '../utils/response.util.js'
import { prisma } from '../config/prisma.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    phone?: string
    role: string
    fullName: string
    status?: string
    companyName?: string
    crNumber?: string
    companyProfile?: any
  }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'غير مصرح: يلزم توفير رمز الدخول (Token)', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as {
      id: string
      email: string
      role: string
      fullName: string
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { companyProfile: true },
    })

    if (!user || user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      return sendError(res, 'الحساب غير متاح أو موقوف مؤقتاً', 403)
    }

    req.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      fullName: user.fullName,
      status: user.status,
      companyName: user.companyProfile?.companyNameAr || '',
      crNumber: user.companyProfile?.crNumber || '',
      companyProfile: user.companyProfile,
    }

    next()
  } catch {
    return sendError(res, 'جلسة غير صالحة أو انتهت مدة الرمز', 401)
  }
}
