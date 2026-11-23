import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Lock,
  ShieldCheck,
  Zap,
  Users,
  Check,
  Eye,
  EyeOff,
  User,
  AlertCircle
} from 'lucide-react'

export default function LoginPage() {
  const [remember, setRemember] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    const val = username.trim().toLowerCase()
    const pwd = password.trim()

    // Importer checks
    const isImporter =
      val === 'importer' ||
      val === 'importer@meynaa.com' ||
      val === 'sara' ||
      val === 'sara@meynaa.com'

    // Provider checks
    const isProvider =
      val === 'provider' ||
      val === 'provider@meynaa.com' ||
      val === 'khalid' ||
      val === 'khalid@meynaa.com'

    // Admin checks
    const isAdmin =
      val === 'admin' ||
      val === 'admin@meynaa.com' ||
      val === 'ahmed' ||
      val === 'ahmed@meynaa.com'

    const emailToSend = val.includes('@')
      ? val
      : isImporter
      ? 'importer@meynaa.com'
      : isProvider
      ? 'provider@meynaa.com'
      : isAdmin
      ? 'admin@meynaa.com'
      : `${val}@meynaa.com`

    try {
      // الاتصال بالباك إند الحقيقي
      const result = await login(emailToSend, pwd)
      const role = result?.user?.role || (isAdmin ? 'SUPER_ADMIN' : isProvider ? 'PROVIDER' : 'IMPORTER')
      if (role === 'SUPER_ADMIN') {
        navigate('/admin')
      } else if (role === 'PROVIDER') {
        navigate('/dashboard')
      } else {
        navigate('/importer')
      }
    } catch {
      // التوجيه التجريبي في حال عدم الاتصال بالسيرفر
      if (isImporter && pwd === '123456') {
        navigate('/importer')
        return
      }
      if (isProvider && pwd === '123456') {
        navigate('/dashboard')
        return
      }
      if (isAdmin && (pwd === '123456' || pwd === 'admin')) {
        navigate('/admin')
        return
      }
      setErrorMessage('بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen font-almarai bg-[#011222] relative flex items-center justify-center p-4 md:p-10 select-none overflow-x-hidden" dir="rtl">
      {/* Floating Buttons Keyframe Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes meynaPillFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float-pill-1 {
          animation: meynaPillFloat 3.8s ease-in-out infinite 0s;
        }
        .animate-float-pill-2 {
          animation: meynaPillFloat 3.8s ease-in-out infinite 1.2s;
        }
      ` }} />

      {/* Top Floating Action: Home Logo */}
      <Link
        to="/"
        className="animate-float-pill-2 fixed top-5 left-5 sm:top-8 sm:left-8 z-50 flex items-center gap-2.5 bg-[#011222]/85 hover:bg-[#081a2e] px-3.5 sm:px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl group"
        title="الرئيسية"
      >
        <img src="/images/meynaa-logo.png" alt="MEYNAA" className="h-7 w-auto object-contain" />
        <span className="text-white font-bold text-xs hidden sm:inline group-hover:text-[#FB8731] transition-colors">
          الرئيسية
        </span>
      </Link>

      {/* Full-bleed Background Image: Container Ship at Sunset (covers entire screen) */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/auth-ship-bg.png"
          alt="سفينة شحن في الغروب"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Right Side (in RTL): White Login Card */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-1">
          <div className="w-full max-w-[540px] bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative">
            {/* Card Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-[#011222] tracking-tight">
                تسجيل الدخول
              </h1>
              <p className="text-[#64748B] text-xs md:text-sm mt-1.5 font-normal">
                مرحباً بك مجدداً يرجى إدخال بياناتك للمتابعة
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs font-bold animate-fade-in text-right">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username / Email Field */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="اسم المستخدم أو البريد الإلكتروني"
                  className="w-full bg-white border border-gray-300 focus:border-[#FB8731] rounded-2xl pr-11 pl-4 py-3.5 text-sm text-[#011222] placeholder-[#94A3B8] focus:outline-none transition-all text-right"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <User className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>

              {/* Password Field with Lock on Right and Show/Hide Toggle on Left */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="كلمة المرور"
                  className="w-full bg-white border border-gray-300 focus:border-[#FB8731] rounded-2xl pr-11 pl-12 py-3.5 text-sm text-[#011222] placeholder-[#94A3B8] focus:outline-none transition-all text-right"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Lock className="w-5 h-5 stroke-[1.8]" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 stroke-[1.8]" /> : <Eye className="w-5 h-5 stroke-[1.8]" />}
                </button>
              </div>

              {/* Remember & Forgot Row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRemember(!remember)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                      remember ? 'bg-[#FB8731] text-white shadow-xs' : 'border border-gray-300 bg-white'
                    }`}
                  >
                    {remember && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-[#011222]">تذكرني</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs md:text-sm font-bold text-[#FB8731] hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FB8731] hover:bg-[#E06F1B] disabled:opacity-75 text-white py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-md shadow-orange-500/20 transition-all mt-4 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <span>تسجيل الدخول</span>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="text-center mt-8 text-xs md:text-sm">
              <span className="text-[#64748B]">ليس لديك حساب ؟ </span>
              <Link to="/register" className="text-[#FB8731] font-bold hover:underline">
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </div>

        {/* Left Side (in RTL): Welcome Text & 3 Pillars on dark overlay card */}
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-2">
          <div className="bg-[#011222]/85 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6 text-right">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                مرحباً بك.... مجدداً !
              </h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mt-2.5 max-w-lg">
                سجل دخولك للوصول إلى حسابك وإدارة شحناتك ومتابعة خدماتك بكل سهولة
              </p>
            </div>

            {/* 3 Pillars in a Row matching XD */}
            <div className="pt-4 flex items-center justify-between max-w-md border-t border-white/10">
              {/* Pillar 1: خدمة متميزة */}
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="w-8 h-8 text-[#FB8731] stroke-[1.8]" />
                <span className="text-xs md:text-sm font-bold text-white">خدمة متميزة</span>
              </div>

              {/* Pillar 2: سرعة في الانجاز */}
              <div className="flex flex-col items-center text-center space-y-2">
                <Zap className="w-8 h-8 text-[#FB8731] stroke-[1.8]" />
                <span className="text-xs md:text-sm font-bold text-white">سرعة في الانجاز</span>
              </div>

              {/* Pillar 3: أمان و موثوقية */}
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#FB8731] stroke-[1.8]" />
                <span className="text-xs md:text-sm font-bold text-white">أمان و موثوقية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
