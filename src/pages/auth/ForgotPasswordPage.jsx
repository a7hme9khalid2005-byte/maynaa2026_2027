import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Users, Send, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

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
        {/* Right Side (in RTL): White Forgot Password Card */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-1">
          <div className="w-full max-w-[540px] bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-center relative">
            {/* Orange Shield with Lock Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#FFF4EB] border border-[#FB8731]/30 flex items-center justify-center text-[#FB8731] mx-auto mb-4 shadow-2xs">
              <ShieldCheck className="w-9 h-9 stroke-[1.8]" />
            </div>

            {/* Card Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-[#011222] tracking-tight">
                نسيت كلمة المرور؟
              </h1>
              <p className="text-[#64748B] text-xs leading-relaxed mt-2 max-w-xs mx-auto font-normal">
                لا تقلق سنرسل لك رابط استعادة كلمة المرور عبر بريدك الإلكتروني المسجل
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#E6F9F0] border border-[#009F65]/30 text-[#009F65] p-6 rounded-2xl text-center space-y-3">
                <p className="font-bold text-sm">تم إرسال رابط الاستعادة إلى بريدك الإلكتروني بنجاح!</p>
                <p className="text-xs text-[#64748B]">يرجى التحقق من صندوق الوارد أو البريد غير الهام.</p>
                <Link
                  to="/login"
                  className="inline-block mt-3 px-6 py-2.5 bg-[#FB8731] text-white rounded-xl text-xs font-bold hover:bg-[#E06F1B] transition-colors"
                >
                  العودة لتسجيل الدخول
                </Link>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="space-y-5"
              >
                {/* Email Field with Label Above */}
                <div className="text-right">
                  <label className="block text-xs font-bold text-[#011222] mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="w-full bg-white border border-gray-300 focus:border-[#FB8731] rounded-2xl px-4 py-3.5 text-sm text-[#011222] placeholder-[#94A3B8] focus:outline-none transition-all text-right"
                  />
                </div>

                {/* Submit Button with Paper Plane Icon */}
                <button
                  type="submit"
                  className="w-full bg-[#FB8731] hover:bg-[#E06F1B] text-white py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-md shadow-orange-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <span>إرسال رابط الاستعادة</span>
                  <Send className="w-5 h-5 stroke-[2] -rotate-45" />
                </button>
              </form>
            )}

            {/* Divider: أو */}
            <div className="relative my-7 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-[#94A3B8] absolute">أو</span>
            </div>

            {/* Back to Login Link matching XD */}
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-[#FB8731] hover:underline transition-all"
            >
              <span>العودة الى تسجيل الدخول</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Left Side (in RTL): Visual Panel on dark overlay card */}
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-2">
          <div className="bg-[#011222]/85 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6 text-center">
            {/* 3 Pillars in a Row matching XD */}
            <div className="pt-2 flex items-center justify-between max-w-md mx-auto w-full px-2">
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

            {/* Slogan */}
            <div className="pt-4 border-t border-white/10">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                شريكك في عالم الشحن
              </h2>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed mt-2 max-w-sm mx-auto font-normal">
                نقدم لك حلول لوجستية متكاملة تربط بين أعمالك والأسواق العالمية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
