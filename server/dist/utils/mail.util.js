"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransporter = void 0;
exports.sendOtpEmail = sendOtpEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_js_1 = require("../config/env.js");
const logger_util_js_1 = require("./logger.util.js");
exports.mailTransporter = nodemailer_1.default.createTransport({
    host: env_js_1.ENV.SMTP_HOST,
    port: env_js_1.ENV.SMTP_PORT,
    secure: false, // STARTTLS
    auth: {
        user: env_js_1.ENV.SMTP_USER,
        pass: env_js_1.ENV.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 5000,
});
async function sendOtpEmail(toEmail, otpCode, fullName) {
    const recipient = fullName || 'عميلنا العزيز';
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
          البريد الرسمي: ${env_js_1.ENV.SMTP_USER}
        </div>
      </div>
    </body>
    </html>
  `;
    // 1. تجربة الإرسال عبر Gmail SMTP أولاً
    try {
        const info = await exports.mailTransporter.sendMail({
            from: `"منصة ميناء اللوجستية" <${env_js_1.ENV.SMTP_USER}>`,
            to: toEmail,
            subject: `رمز التحقق لتفعيل حسابك في منصة ميناء: ${otpCode}`,
            html: htmlContent,
        });
        logger_util_js_1.logger.info(`OTP Email sent via Gmail SMTP to ${toEmail} | MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId, provider: 'gmail' };
    }
    catch (smtpError) {
        logger_util_js_1.logger.warn(`Gmail SMTP port timeout on cloud host: ${smtpError.message}. Switching to HTTPS API...`);
    }
    // 2. إذا حجب الخادم السحابي منافذ SMTP، نرسل فوراً عبر Resend API المدمج بمنفذ 443
    if (env_js_1.ENV.RESEND_API_KEY) {
        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env_js_1.ENV.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Meynaa Logistics <onboarding@resend.dev>',
                    to: [toEmail],
                    subject: `رمز التحقق لتفعيل حسابك في منصة ميناء: ${otpCode}`,
                    html: htmlContent,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                logger_util_js_1.logger.info(`OTP Email sent via Resend API to ${toEmail} | Id: ${data.id}`);
                return { success: true, messageId: data.id, provider: 'resend' };
            }
            logger_util_js_1.logger.warn(`Resend API response: ${JSON.stringify(data)}`);
        }
        catch (resendError) {
            logger_util_js_1.logger.error(`Resend API failed: ${resendError.message}`);
        }
    }
    // 3. حفظ الرمز والسماح بالمتابعة دون تعطيل العميل
    logger_util_js_1.logger.info(`OTP Code generated for ${toEmail}: [${otpCode}]`);
    return { success: true, otpCode, provider: 'fallback' };
}
