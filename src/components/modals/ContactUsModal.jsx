import { useState, useEffect } from 'react'
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Ship
} from 'lucide-react'

export default function ContactUsModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      // reset after a while if desired
    }, 3000)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
            اتصل بنا
          </h2>
        </div>

        {/* Main Content White Container (matching XD screenshot) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200/90 relative text-right space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Column 1 (Right in RTL): Contact Form */}
            <div className="space-y-4">
              {submitted ? (
                <div className="bg-[#E6F9F0] border border-[#009F65]/30 text-[#009F65] p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#009F65] mx-auto" />
                  <p className="font-bold text-base">تم إرسال رسالتك بنجاح!</p>
                  <p className="text-xs text-[#475569]">
                    شكراً لتواصلك معنا، سيقوم فريق خدمة العملاء بالرد على استفسارك في أقرب وقت.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ fullName: '', email: '', subject: '', message: '' })
                    }}
                    className="mt-4 px-6 py-2 bg-[#FB8731] text-white rounded-xl text-xs font-bold hover:bg-[#E06F1B] transition-colors cursor-pointer"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#011222] mb-1.5 text-right">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="الأسم الكامل"
                      className="w-full bg-[#F1F4F9] border border-transparent focus:border-[#FB8731] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#011222] placeholder-gray-400 focus:outline-none transition-all text-right"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#011222] mb-1.5 text-right">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="البريد الإلكتروني"
                      className="w-full bg-[#F1F4F9] border border-transparent focus:border-[#FB8731] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#011222] placeholder-gray-400 focus:outline-none transition-all text-right"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-[#011222] mb-1.5 text-right">
                      الموضوع
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="الموضوع"
                      className="w-full bg-[#F1F4F9] border border-transparent focus:border-[#FB8731] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#011222] placeholder-gray-400 focus:outline-none transition-all text-right"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-[#011222] mb-1.5 text-right">
                      الرسالة
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="الرسالة"
                      className="w-full bg-[#F1F4F9] border border-transparent focus:border-[#FB8731] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#011222] placeholder-gray-400 focus:outline-none transition-all text-right resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#FB8731] hover:bg-[#E06F1B] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>إرسال رسالة</span>
                    <Send className="w-4 h-4 -rotate-45" />
                  </button>
                </form>
              )}
            </div>

            {/* Column 2 (Left in RTL): 4 Info Cards matching XD screenshot */}
            <div className="space-y-3">
              {/* Card 1: اتصل بنا (Phone) */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF4EB] text-[#FB8731] flex items-center justify-center">
                    <Phone className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#011222]">
                    اتصل بنا
                  </h4>
                </div>
                <div className="space-y-0.5 text-left text-xs text-[#475569] font-medium" dir="ltr">
                  <div>+566 50 123 4567 :رقم الهاتف</div>
                  <div>800 123 45 :الرقم المجاني</div>
                </div>
              </div>

              {/* Card 2: البريد الإلكتروني (Email) */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF4EB] text-[#FB8731] flex items-center justify-center">
                    <Mail className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#011222]">
                    البريد الإلكتروني
                  </h4>
                </div>
                <div className="space-y-0.5 text-left text-xs text-[#475569] font-medium" dir="ltr">
                  <div>support@meyna.com :دعم العملاء</div>
                  <div>business@meyna.com :الإستفسارات التجارية</div>
                </div>
              </div>

              {/* Card 3: الموقع (Location) with Dubai Map Preview */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF4EB] text-[#FB8731] flex items-center justify-center">
                    <MapPin className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#011222]">
                    الموقع
                  </h4>
                </div>
                <div className="text-right text-xs text-[#475569] font-medium mb-2">
                  المقر الرئيسي : دبي _الإمارات العربية المتحدة
                </div>
                {/* Map Preview Image matching XD */}
                <div className="w-full h-16 rounded-xl overflow-hidden border border-gray-200/80 shadow-xs relative">
                  <img
                    src="/images/dubai-map-preview.png"
                    alt="موقع ميناء - دبي"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Card 4: ساعات العمل (Working Hours) */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF4EB] text-[#FB8731] flex items-center justify-center">
                    <Clock className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#011222]">
                    ساعات العمل
                  </h4>
                </div>
                <div className="text-right text-xs text-[#475569] font-medium">
                  الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Pill matching XD: اتصل بنا | Meyna Logistics 2026 */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-100 text-[11px] text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#009F65]" />
              <span className="font-bold text-[#011222]">Meyna Logistics</span>
              <span>2026</span>
              <div className="w-5 h-5 rounded bg-[#FB8731] flex items-center justify-center text-white text-[10px]">
                <Ship className="w-3 h-3" />
              </div>
            </div>
            <div className="px-3.5 py-1 rounded-full bg-gray-100 font-bold text-[#FB8731] border-b-2 border-[#FB8731]">
              اتصل بنا
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
