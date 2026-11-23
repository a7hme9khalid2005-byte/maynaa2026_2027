import api from './api.js'

export const authService = {
  // تسجيل الدخول
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    if (res?.data?.accessToken) {
      localStorage.setItem('meynaa_token', res.data.accessToken)
      localStorage.setItem('meynaa_refresh_token', res.data.refreshToken)
      localStorage.setItem('meynaa_user', JSON.stringify(res.data.user))
    }
    return res
  },

  // إنشاء حساب جديد
  async register(data) {
    const res = await api.post('/auth/register', data)
    if (res?.data?.accessToken) {
      localStorage.setItem('meynaa_token', res.data.accessToken)
      localStorage.setItem('meynaa_refresh_token', res.data.refreshToken)
      localStorage.setItem('meynaa_user', JSON.stringify(res.data.user))
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
}

export default authService
