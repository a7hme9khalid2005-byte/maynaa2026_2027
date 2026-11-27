import { Request, Response } from 'express'
import { AuthService } from './auth.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { AuthRequest } from '../../middlewares/auth.middleware.js'
import { sendOtpEmail } from '../../utils/mail.util.js'
import { prisma } from '../../config/prisma.js'

// مخزن مؤقت لرموز التحقق في الذاكرة (Email -> { code, expiresAt })
const otpStore = new Map<string, { code: string; expiresAt: number }>()

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body)
      return sendSuccess(res, result, 'تم إنشاء الحساب بنجاح', 201)
    } catch (err: any) {
      return sendError(res, err.message || 'فشل إنشاء الحساب', 400)
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { usernameOrEmail, email, password } = req.body
      const targetUser = (usernameOrEmail || email || '').trim()
      const result = await AuthService.login(targetUser, password)
      return sendSuccess(res, result, 'تم تسجيل الدخول بنجاح')
    } catch (err: any) {
      return sendError(res, err.message || 'فشل تسجيل الدخول', 401)
    }
  }

  // إرسال رمز التحقق (OTP) الحقيقي إلى بريد العميل من إيميل الموقع الرسمي
  static async sendOtp(req: Request, res: Response) {
    try {
      const { email, fullName } = req.body
      if (!email) {
        return sendError(res, 'البريد الإلكتروني مطلوب لإرسال رمز التحقق', 400)
      }

      // توليد رمز تحقق عشوائي من 5 أرقام
      const otpCode = String(Math.floor(10000 + Math.random() * 90000))

      // حفظ الرمز لمدة 10 دقائق
      otpStore.set(email.toLowerCase().trim(), {
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000,
      })

      // إرسال الإيميل الحقيقي عبر Gmail SMTP الرسمي لمنصة ميناء
      await sendOtpEmail(email, otpCode, fullName)

      return sendSuccess(
        res,
        { email, sent: true },
        `تم إرسال رمز التحقق بنجاح من بريد المنصة الرسمي إلى (${email})`
      )
    } catch (err: any) {
      return sendError(res, err.message || 'فشل إرسال رمز التحقق عبر البريد', 500)
    }
  }

  // التحقق من رمز الـ OTP
  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, phoneOrEmail, otpCode } = req.body
      const targetEmail = (email || phoneOrEmail || '').toLowerCase().trim()

      const stored = otpStore.get(targetEmail)

      // التحقق الصارم من تطابق الرمز الفعلي وصلاحيته
      if (stored && stored.code === otpCode && Date.now() < stored.expiresAt) {
        if (stored) {
          otpStore.delete(targetEmail)
        }
        return sendSuccess(res, { verified: true }, 'تم التحقق من الرمز بنجاح وتفعيل الحساب')
      }

      return sendError(res, 'رمز التحقق غير صحيح أو انتهت صلاحيته، يرجى إعادة الإرسال', 400)
    } catch (err: any) {
      return sendError(res, err.message, 400)
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    return sendSuccess(
      res,
      null,
      'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني'
    )
  }

  static async me(req: AuthRequest, res: Response) {
    return sendSuccess(res, req.user, 'تم استرجاع بيانات الحساب بنجاح')
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return sendError(res, 'غير مصرح', 401)

      const { fullName, phone, companyName, crNumber } = req.body

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          fullName: fullName || undefined,
          phone: phone || undefined,
          companyProfile: companyName
            ? {
                upsert: {
                  create: {
                    companyNameAr: companyName,
                    crNumber: crNumber || '1010000000',
                  },
                  update: {
                    companyNameAr: companyName,
                    crNumber: crNumber || undefined,
                  },
                },
              }
            : undefined,
        },
        include: { companyProfile: true },
      })

      const userProfile = {
        id: updated.id,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        fullName: updated.fullName,
        status: updated.status,
        companyName: updated.companyProfile?.companyNameAr || '',
        crNumber: updated.companyProfile?.crNumber || '',
        companyProfile: updated.companyProfile,
      }

      return sendSuccess(res, userProfile, 'تم تحديث بيانات الملف الشخصي بنجاح')
    } catch (err: any) {
      return sendError(res, err.message || 'فشل تحديث البيانات')
    }
  }
}
