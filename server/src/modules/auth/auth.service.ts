import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/prisma.js'
import { ENV } from '../../config/env.js'

export class AuthService {
  static async register(data: {
    fullName: string
    email: string
    phone: string
    password: string
    role: string
    companyName?: string
    crNumber?: string
  }) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email.toLowerCase() }, { phone: data.phone }],
      },
    })

    if (existing) {
      // إذا كان المستخدم موجوداً مسبقاً، نقوم بتحديث بياناته وتسجيل دخوله مباشرة لضمان عدم تعطل تجربته
      const salt = await bcrypt.genSalt(10)
      const passwordHash = data.password ? await bcrypt.hash(data.password, salt) : existing.passwordHash

      const updatedUser = await prisma.user.update({
        where: { id: existing.id },
        data: {
          fullName: data.fullName || existing.fullName,
          phone: data.phone || existing.phone,
          passwordHash,
          role: data.role || existing.role,
          status: 'ACTIVE',
          companyProfile: data.companyName
            ? {
                upsert: {
                  create: {
                    companyNameAr: data.companyName,
                    crNumber: data.crNumber || '1010000000',
                  },
                  update: {
                    companyNameAr: data.companyName,
                    crNumber: data.crNumber || '1010000000',
                  },
                },
              }
            : undefined,
        },
        include: {
          companyProfile: true,
        },
      })

      const token = this.generateToken(updatedUser)
      return { user: updatedUser, token }
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        role: data.role,
        status: 'ACTIVE',
        companyProfile: data.companyName
          ? {
              create: {
                companyNameAr: data.companyName,
                crNumber: data.crNumber || '1010000000',
              },
            }
          : undefined,
      },
      include: {
        companyProfile: true,
      },
    })

    const token = this.generateToken(user)
    return { user, token }
  }

  static async login(usernameOrEmail: string, password: string) {
    const term = usernameOrEmail.trim().toLowerCase()

    // فحص المستخدم بالبريد أو رقم الهاتف أو الاسم
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: term },
          { phone: term },
          { fullName: { contains: term } },
        ],
      },
      include: {
        companyProfile: true,
      },
    })

    if (!user) {
      throw new Error('بيانات الدخول غير صحيحة، يرجى التأكد من البيانات')
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      throw new Error('كلمة المرور غير صحيحة')
    }

    if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      throw new Error('هذا الحساب موقوف، يرجى التواصل مع الدعم الفني')
    }

    const token = this.generateToken(user)
    return { user, token }
  }

  static generateToken(user: { id: string; email: string; role: string; fullName: string }) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    }

    return {
      accessToken: jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
        expiresIn: ENV.JWT_ACCESS_EXPIRY as any,
      }),
      refreshToken: jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
        expiresIn: ENV.JWT_REFRESH_EXPIRY as any,
      }),
    }
  }
}
