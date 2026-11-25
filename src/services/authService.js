import api from './api.js'

export const authService = {
  // تسجيل الدخول
  async login(email, password) {
    const res = await api.post('/auth/login', { usernameOrEmail: email, email, password })
    const token = res?.data?.accessToken || res?.data?.token?.accessToken
    const refreshToken = res?.data?.refreshToken || res?.data?.token?.refreshToken
    const user = res?.data?.user
    if (token) {
      localStorage.setItem('meynaa_token', token)
      if (refreshToken) localStorage.setItem('meynaa_refresh_token', refreshToken)
      if (user) localStorage.setItem('meynaa_user', JSON.stringify(user))
    }
    return res
  },

  // إنشاء حساب جديد
  async register(data) {
    const res = await api.post('/auth/register', data)
    const token = res?.data?.accessToken || res?.data?.token?.accessToken
    const refreshToken = res?.data?.refreshToken || res?.data?.token?.refreshToken
    const user = res?.data?.user
    if (token) {
      localStorage.setItem('meynaa_token', token)
      if (refreshToken) localStorage.setItem('meynaa_refresh_token', refreshToken)
      if (user) localStorage.setItem('meynaa_user', JSON.stringify(user))
    }
    return res
  },

  // جلب الملف الشخصي للمستخدم الحالي
  async getProfile() {
    return api.get('/auth/profile')
  },

  // تسجيل الخروج
  logout() {
    localStorage.removeItem('meynaa_token')
    localStorage.removeItem('meynaa_refresh_token')
    localStorage.removeItem('meynaa_user')
  },

  // المستخدم المخزن محلياً
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('meynaa_user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  // التحقق من حالة تسجيل الدخول
  isAuthenticated() {
    return !!localStorage.getItem('meynaa_token')
  },

  // إرسال رمز التحقق (OTP) إلى بريد العميل
  async sendOtp(email, fullName) {
    try {
      return await api.post('/auth/send-otp', { email, fullName })
    } catch {
      return await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      }).then((r) => r.json())
    }
  },

  // التحقق من رمز الـ OTP
  async verifyOtp(email, otpCode) {
    try {
      return await api.post('/auth/verify-otp', { email, otpCode })
    } catch {
      return await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode }),
      }).then((r) => r.json())
    }
  },
}

export default authService
