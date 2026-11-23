import { Request, Response } from 'express'
import { AuthService } from './auth.service.js'
import { sendSuccess, sendError } from '../../utils/response.util.js'
import { AuthRequest } from '../../middlewares/auth.middleware.js'

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
      const { usernameOrEmail, password } = req.body
      const result = await AuthService.login(usernameOrEmail, password)
      return sendSuccess(res, result, 'تم تسجيل الدخول بنجاح')
    } catch (err: any) {
      return sendError(res, err.message || 'فشل تسجيل الدخول', 401)
    }
  }

  static async sendOtp(req: Request, res: Response) {
    // محاكاة إرسال OTP عبر SMS
    return sendSuccess(
      res,
      { otpPreview: '1234' },
      'تم إرسال رمز التحقق بنجاح إلى هاتفك المسجل'
    )
  }

  static async verifyOtp(req: Request, res: Response) {
    const { otpCode } = req.body
    if (otpCode === '1234' || otpCode === '0000') {
      return sendSuccess(res, { verified: true }, 'تم التحقق من الرمز بنجاح')
    }
    return sendError(res, 'رمز التحقق غير صحيح، يرجى المحاولة مجدداً', 400)
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
}
