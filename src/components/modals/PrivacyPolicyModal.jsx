import { useEffect } from 'react'
import {
  X,
  FileText,
  Lock,
  Database,
  Settings,
  Users,
  ShieldCheck
} from 'lucide-react'

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-almarai"
      dir="rtl"
    >
      {/* Dimmed Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#011222]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Outer Modal Container with decorative graphics matching XD */}
      <div className="relative z-10 w-full max-w-4xl my-auto animate-scale-up pt-6 sm:pt-8">
        {/* Close Button Inside the Top-Left Orange Circle */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 -left-4 sm:top-1 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FB8731] hover:bg-[#E06F1B] text-white flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer z-30 group"
          title="إغلاق النافذة"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] text-white group-hover:rotate-90 transition-transform duration-300 drop-shadow-sm" />
        </button>

        {/* Decorative Bottom-Left Orange Dots (matching XD) */}
        <div className="absolute -bottom-7 left-8 flex items-center gap-1.5 pointer-events-none -z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
        </div>

        {/* Decorative Bottom-Right Modern Orange Wave (matching XD) */}
        <div className="absolute -bottom-8 -right-8 w-48 h-40 bg-gradient-to-tl from-[#FB8731] via-[#FB8731]/70 to-transparent rounded-tl-[100px] pointer-events-none -z-10 opacity-90" />

        {/* Main Title Above Box */}
        <div className="text-right mb-4 pr-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            سياسة الخصوصية
          </h2>
        </div>

        {/* Main Content White Card (matching XD screenshot) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200/90 relative text-right">
          
          {/* Header Row: Document Icon with Lock + Title */}
          <div className="flex items-center justify-center sm:justify-start gap-4 pb-6 border-b border-gray-200/80">
            {/* Orange Document with Lock Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8F3] border border-[#FB8731]/30 text-[#FB8731] flex items-center justify-center shrink-0 shadow-xs relative">
              <FileText className="w-7 h-7 stroke-[1.8]" />
              <div className="absolute bottom-1.5 left-1.5 bg-[#FB8731] text-white p-1 rounded-md shadow-xs">
                <Lock className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>

            <div className="text-right">
              <h3 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
                سياسة Meyna Logistics
              </h3>
              <p className="text-base sm:text-lg font-bold text-[#475569] mt-0.5">
                - مبسطة وواضحة
              </p>
            </div>
          </div>

          {/* 4 Quadrants Grid with Cross Dividers (matching XD) */}
          <div className="grid grid-cols-1 md:grid-cols-2 pt-6">
            
            {/* Top-Right Quadrant: ماذا نجمع؟ */}
            <div className="p-4 sm:p-6 md:border-l md:border-b border-gray-200 text-right">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#FB8731] flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold text-[#011222]">ماذا نجمع؟</h4>
              </div>
              <ul className="space-y-2.5 pr-2">
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>البيانات الأساسية: الاسم، الهاتف، البريد الإلكتروني</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>بيانات الموقع: GPS لمتابعة حركة الشحن</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>بيانات الجهاز: مدخل الجهاز، IP</span>
                </li>
              </ul>
            </div>

            {/* Top-Left Quadrant: لماذا نستخدمها؟ */}
            <div className="p-4 sm:p-6 md:border-b border-gray-200 text-right">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#FB8731] flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold text-[#011222]">لماذا نستخدمها؟</h4>
              </div>
              <ul className="space-y-2.5 pr-2">
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>لتقديم الخدمات</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>للتسليم الصحيح</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>للتواصل معك</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>لتحسين المنصة</span>
                </li>
              </ul>
            </div>

            {/* Bottom-Right Quadrant: مع من نشاركها؟ */}
            <div className="p-4 sm:p-6 md:border-l border-gray-200 text-right border-t md:border-t-0">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#FB8731] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold text-[#011222]">مع من نشاركها؟</h4>
              </div>
              <ul className="space-y-2.5 pr-2">
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>الموظفون المعنيون</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>شركاء التوصيل</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>الجهات القانونية</span>
                </li>
              </ul>
            </div>

            {/* Bottom-Left Quadrant: كيف نحميها؟ */}
            <div className="p-4 sm:p-6 text-right border-t md:border-t-0 border-gray-200">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#FB8731] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold text-[#011222]">كيف نحميها؟</h4>
              </div>
              <ul className="space-y-2.5 pr-2">
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>التشفير القوي</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>الوصول المقيد</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-[#011222] font-semibold leading-relaxed">
                  <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                  <span>فحوصات دورية</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Pill Bar under the box matching XD */}
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl px-6 py-3.5 flex items-center justify-between text-xs font-bold shadow-lg mt-4">
          {/* Active Tab: سياسة الخصوصية */}
          <div className="flex items-center gap-2">
            <span className="text-[#011222] font-bold text-xs sm:text-sm border-b-2 border-[#FB8731] pb-0.5">
              سياسة الخصوصية
            </span>
          </div>

          {/* Left Brand Badge */}
          <div className="flex items-center gap-2.5" dir="ltr">
            <span className="text-gray-500 font-bold text-xs sm:text-sm">
              Meyna Logistics 2026
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#FB8731] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
