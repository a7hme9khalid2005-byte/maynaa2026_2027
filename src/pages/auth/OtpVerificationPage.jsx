import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  Zap,
  Users,
  Check,
  ArrowRight,
  RefreshCw,
  Mail
} from 'lucide-react'

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', ''])
  const [timer, setTimer] = useState(59)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const canResend = timer === 0
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()

  // Data passed from Register Page
  const accountType = location.state?.accountType || 'importer'
  const userEmail = location.state?.email || 'user@example.com'

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Handle single digit input
  const handleChange = (index, value) => {
    // Only accept numeric characters
    const numericValue = value.replace(/[^0-9]/g, '')
    if (!numericValue && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = numericValue.slice(-1) // Take the last entered character
    setOtp(newOtp)
    setErrorMessage('')

    // Auto-focus next input
    if (numericValue && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste full 5-digit code
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 5)
    if (pastedData) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)
      const nextIndex = Math.min(pastedData.length, 4)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  // Handle submit verification
  const handleVerify = (e) => {
    e.preventDefault()
    const fullCode = otp.join('')

    if (fullCode.length < 5) {
      setErrorMessage('يرجى إدخال رمز التحقق كاملاً المكون من 5 أرقام')
      return
    }

    // Success animation and routing
    setIsSuccess(true)
    setTimeout(() => {
      if (accountType === 'importer') {
        navigate('/importer')
      } else {
        navigate('/dashboard')
      }
    }, 1200)
  }

  // Handle Resend code
  const handleResend = () => {
    if (!canResend) return
    setOtp(['', '', '', '', ''])
    setTimer(59)
    setErrorMessage('')
    inputRefs.current[0]?.focus()
  }

  return (
    <div
      className="min-h-screen font-almarai relative flex items-center justify-center p-4 md:p-8 bg-[#011222] overflow-x-hidden select-none py-12"
      dir="rtl"
    >
      {/* Full-bleed Background Image: Container Ship at Sunset */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/auth-ship-bg.png"
          alt="سفينة شحن في الغروب"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Left Column (in RTL): OTP Card */}
        <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
          <div className="w-full max-w-[540px] bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-center">
            {/* Top Shield Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#FFF4EB] border border-[#FB8731]/30 flex items-center justify-center text-[#FB8731] mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-[#011222] tracking-tight">
                رمز التحقق
              </h1>
              <p className="text-[#64748B] text-xs md:text-sm mt-2 leading-relaxed max-w-sm mx-auto font-normal">
                تم إرسال رمز التحقق المكون من <span className="font-bold text-[#011222]">5 أرقام</span> إلى:
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200/80 text-xs font-bold text-[#011222] font-sans" dir="ltr">
                <Mail className="w-3.5 h-3.5 text-[#FB8731]" />
                <span>{userEmail}</span>
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              {/* 5 Input Boxes */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3.5" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    autoFocus={index === 0}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 transition-all font-sans focus:outline-none ${
                      digit
                        ? 'border-[#FB8731] bg-[#FFF8F3] text-[#011222] shadow-xs'
                        : 'border-gray-200 bg-gray-50/50 text-gray-800 focus:border-[#FB8731] focus:bg-white'
                    }`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="text-xs text-red-500 font-bold animate-shake">
                  {errorMessage}
                </p>
              )}

              {/* Success Message */}
              {isSuccess && (
                <div className="p-3 bg-[#E6F9F0] text-[#009F65] rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>تم التحقق بنجاح! جاري تحويلك إلى لوحة التحكم...</span>
                </div>
              )}

              {/* Timer & Resend Option */}
              <div className="text-center text-xs text-gray-500 pt-1">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex items-center gap-1.5 text-[#FB8731] font-bold hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة إرسال الرمز الآن</span>
                  </button>
                ) : (
                  <span>
                    إعادة إرسال الرمز خلال{' '}
                    <span className="font-bold text-[#011222] font-sans">
                      00:{timer < 10 ? `0${timer}` : timer}
                    </span>{' '}
                    ثانية
                  </span>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSuccess}
                className="w-full bg-[#FB8731] hover:bg-[#E06F1B] text-white py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>تأكيد ومتابعة</span>
                <Check className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>

            {/* Back to Register or Change Info */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-center text-xs text-gray-500">
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#FB8731] font-bold transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة وتعديل بيانات التسجيل</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (in RTL): Brand Text & 3 Pillars on dark overlay card */}
        <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
          <div className="bg-[#011222]/85 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6 text-center">
            {/* Brand Slogan */}
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                بوابتك الى عالم التجارة والشحن الدولي
              </h2>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-normal">
                أنضم الى ميناء واحصل على تجربة شحن اسهل واسرع واكثر اماناً
              </p>
            </div>

            {/* 3 Pillars in a Row */}
            <div className="pt-4 flex items-center justify-between max-w-md mx-auto w-full px-2 border-t border-white/10">
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
