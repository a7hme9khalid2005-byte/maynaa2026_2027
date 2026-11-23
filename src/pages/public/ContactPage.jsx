import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Phone, Mail, MapPin, Headphones, ShieldCheck, Clock } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen font-almarai bg-[#F0F3F8]" dir="rtl">
      <Navbar />

      {/* Top Hero Section with Customer Support Operator Background matching XD */}
      <section className="relative pt-20 overflow-hidden bg-[#011222]">
        <div className="relative w-full min-h-[380px] md:min-h-[440px] lg:min-h-[480px] overflow-hidden flex items-center">
          {/* Operator Image */}
          <img
            src="/images/contact-operator.png"
            alt="تواصل معنا"
            className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
          />
          {/* Dark gradient on the left side to ensure white text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />

          {/* Left-aligned Content Container in RTL */}
          <div className="relative z-10 max-w-[1500px] mx-auto px-8 md:px-16 w-full flex items-center justify-start py-12">
            <div className="max-w-xl text-right text-white space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                تواصل معنا
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-white/95 leading-relaxed font-normal drop-shadow-sm max-w-md">
                نحن هنا لمساعدتك لتقديم أي إستفسار أو طلب خدمة
              </p>

              {/* 3 Circular Highlights in a Row matching XD */}
              <div className="pt-4 flex items-center justify-start gap-6 sm:gap-8 flex-wrap">
                {/* Highlight 1: رد سريع */}
                <div className="flex flex-col items-center text-center max-w-[110px]">
                  <div className="w-10 h-10 rounded-full border border-[#FB8731] flex items-center justify-center text-[#FB8731] mb-2 bg-black/20 backdrop-blur-xs">
                    <Clock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[11px] text-white/90 font-medium leading-tight">
                    رد سريع على استفسارتك
                  </span>
                </div>

                {/* Highlight 2: مستشارون متخصصون */}
                <div className="flex flex-col items-center text-center max-w-[130px]">
                  <div className="w-10 h-10 rounded-full border border-[#FB8731] flex items-center justify-center text-[#FB8731] mb-2 bg-black/20 backdrop-blur-xs">
                    <ShieldCheck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[11px] text-white/90 font-medium leading-tight">
                    مستشارون متخصصون في الشحن والتخليص
                  </span>
                </div>

                {/* Highlight 3: دعم فني */}
                <div className="flex flex-col items-center text-center max-w-[110px]">
                  <div className="w-10 h-10 rounded-full border border-[#FB8731] flex items-center justify-center text-[#FB8731] mb-2 bg-black/20 backdrop-blur-xs">
                    <Headphones className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[11px] text-white/90 font-medium leading-tight">
                    دعم فني على مدار الساعة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating White Contact Container matching XD */}
      <section className="relative z-20 -mt-16 md:-mt-20 pb-24 px-6">
        <div className="max-w-[1300px] mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (in RTL): 3 Info Cards Stacked */}
            <div className="lg:col-span-5 space-y-4">
              {/* Card 1: Phone */}
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Phone className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#011222] tracking-tight" dir="ltr">
                    +566 50 123 4567
                  </div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">اتصل بنا</div>
                </div>
              </div>

              {/* Card 2: Email */}
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Mail className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-[#011222] tracking-tight" dir="ltr">
                    info@mina.com
                  </div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">راسلنا عبر البريد الإلكتروني</div>
                </div>
              </div>

              {/* Card 3: Location */}
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-[#011222]">
                    دبي_الإمارات العربية المتحدة
                  </div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">زورونا في مكتبنا</div>
                </div>
              </div>
            </div>

            {/* Right Column (in RTL): Message Form */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-gray-200/80 rounded-2xl p-7 md:p-9 shadow-2xs">
              <div className="text-right mb-6">
                <h2 className="text-2xl font-bold text-[#011222]">أرسل لنا رسالة</h2>
                <p className="text-xs text-[#64748B] mt-1">سنقوم بالرد عليك في اقرب وقت ممكن</p>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center">
                  <h3 className="font-bold text-lg mb-1">تم إرسال رسالتك بنجاح!</h3>
                  <p className="text-sm">شكراً لتواصلك معنا، سيتواصل معك فريقنا في أسرع وقت.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSubmitted(true)
                  }}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="الاسم الكامل"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#011222] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="البريد الإلكتروني"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#011222] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={4}
                      required
                      placeholder="الرسالة"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl p-4 text-sm text-[#011222] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FB8731] resize-none text-right"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FB8731] hover:bg-[#E06F1B] text-white py-3.5 rounded-xl font-bold text-base shadow-md shadow-orange-500/20 transition-all mt-2 cursor-pointer"
                  >
                    أرسل رسالة
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
