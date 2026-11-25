import crypto from 'crypto'

const SECRET = 'meynaa_otp_hmac_secret_2026_production'

function createOtpHash(email, code, expiresAt) {
  return crypto.createHmac('sha256', SECRET).update(`${email}:${code}:${expiresAt}`).digest('hex')
}

globalThis._meynaa_otps = globalThis._meynaa_otps || new Map()

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' })
  }

  try {
    const { email, phoneOrEmail, otpCode, token, expiresAt } = req.body || {}
    const targetEmail = (email || phoneOrEmail || '').toLowerCase().trim()
    const code = String(otpCode || '').trim()

    // 1. التحقق الصارم والآمن عبر HMAC Token للرمز المرسل للإيميل فقط
    if (token && expiresAt) {
      if (Date.now() > Number(expiresAt)) {
        return res.status(400).json({
          success: false,
          message: 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد'
        })
      }
      const expectedHash = createOtpHash(targetEmail, code, expiresAt)
      if (expectedHash === token) {
        return res.status(200).json({
          success: true,
          message: 'تم التحقق من الرمز بنجاح وتفعيل الحساب',
          data: { verified: true }
        })
      }
    }

    // 3. التحقق من الذاكرة المؤقتة (إن وجدت في نفس الـ Instance)
    const stored = globalThis._meynaa_otps.get(targetEmail)
    if (stored && stored.code === code && Date.now() < stored.expiresAt) {
      globalThis._meynaa_otps.delete(targetEmail)
      return res.status(200).json({
        success: true,
        message: 'تم التحقق من الرمز بنجاح وتفعيل الحساب',
        data: { verified: true }
      })
    }

    return res.status(400).json({
      success: false,
      message: 'رمز التحقق غير صحيح، يرجى التأكد من الرمز المرسل إلى بريدك'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
