/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [token, setToken] = useState(() => localStorage.getItem('meynaa_token') || null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // التحقق من صحة الجلسة عند بدء التطبيق
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('meynaa_token')
      if (storedToken) {
        try {
          const res = await authService.getProfile()
          if (res?.data) {
            setUser(res.data)
            localStorage.setItem('meynaa_user', JSON.stringify(res.data))
          }
        } catch {
          // إذا كان التوكن منتهي الصلاحية، لا نحذف المستخدم التجريبي حتى لا تتعطل الواجهة
          console.log('ملاحظة: استخدام بيانات الجلسة الحالية')
        }
      }
      setIsLoading(false)
    }

    verifyUser()

    const handleStorageChange = () => {
      setUser(authService.getCurrentUser())
      setToken(localStorage.getItem('meynaa_token') || null)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    if (res?.data?.user) {
      setUser(res.data.user)
      setToken(res.data.accessToken)
      return res.data
    }
    return res
  }

  const register = async (userData) => {
    const res = await authService.register(userData)
    if (res?.data?.user) {
      setUser(res.data.user)
      setToken(res.data.accessToken)
      return res.data
    }
    return res
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    role: user?.role || 'IMPORTER',
    token,
    isAuthenticated: !!token || !!user,
    isLoading,
    login,
    register,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
