import nodemailer from 'nodemailer'
import { ENV } from '../config/env.js'
import { logger } from './logger.util.js'

export const mailTransporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: false, // STARTTLS
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

export async function sendOtpEmail(toEmail: string, otpCode: string, fullName?: string) {
  const recipient = fullName || 'عميلنا العزيز'
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; direction: rtl; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(1, 18, 34, 0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #011222 0%, #0d2847 100%); padding: 32px 24px; text-align: center; color: #ffffff; border-bottom: 3px solid #fb8731; }
        .logo-text { font-size: 24px; font-weight: 900; color: #fb8731; letter-spacing: 1px; margin: 0; }
        .platform-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
        .content { padding: 32px 28px; text-align: right; color: #1e293b; }
        .greeting { font-size: 16px; font-weight: bold; margin-bottom: 12px; color: #011222; }
        .desc { font-size: 13px; line-height: 1.7; color: #475569; margin-bottom: 24px; }
        .otp-box { background: #fff8f1; border: 2px dashed #fb8731; border-radius: 16px; padding: 18px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; color: #fb8731; letter-spacing: 10px; margin: 0; }
        .otp-hint { font-size: 11px; color: #9a3412; font-weight: bold; margin-top: 6px; }
        .security-note { background: #f8fafc; border-radius: 12px; padding: 14px; font-size: 11px; color: #64748b; line-height: 1.6; border: 1px solid #e2e8f0; margin-top: 20px; }
        .footer { padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; background: #fafafa; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="logo-text">مــيــنـــاء | MEYNAA</h1>
          <div class="platform-sub">المنصة اللوجستية الرقمية الموحدة</div>
        </div>
        <div class="content">
          <div class="greeting">مرحباً بك، ${recipient} 👋</div>
          <p class="desc">
            شكراً لانضمامك إلى منصة ميناء اللوجستية. لتأكيد وتفعيل حسابك والبدء في إدارة عمليات الشحن والاستيراد، يرجى إدخال رمز التحقق التالي:
          </p>

          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
            <div class="otp-hint">صالح لمدة 10 دقائق فقط</div>
          </div>

          <div class="security-note">
            ⚠️ <strong>ملاحظة أمنية:</strong> لا تشارك رمز التحقق هذا مع أي شخص إطلاقاً. فريق منصة ميناء لن يطلب منك هذا الرمز أبداً تحت أي ظرف.
          </div>
        </div>
        <div class="footer">
          جميع الحقوق محفوظة © ${new Date().getFullYear()} شركة ميناء للخدمات اللوجستية المحدودة<br>
          البريد الرسمي: ${ENV.SMTP_USER}
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const info = await mailTransporter.sendMail({
      from: `"منصة ميناء اللوجستية" <${ENV.SMTP_USER}>`,
      to: toEmail,
      subject: `رمز التحقق لتفعيل حسابك في منصة ميناء: ${otpCode}`,
      html: htmlContent,
    })
    logger.info(`OTP Email sent to ${toEmail} | MessageId: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    logger.error(`Failed to send OTP Email to ${toEmail}: ${error.message}`)
    throw new Error(`تعذر إرسال رمز التحقق عبر البريد: ${error.message}`)
  }
}
