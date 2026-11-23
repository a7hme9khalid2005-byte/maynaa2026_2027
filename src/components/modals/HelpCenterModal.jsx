import { useState, useEffect } from 'react'
import {
  X,
  Search,
  Headphones,
  ClipboardList,
  CreditCard,
  MapPin,
  Package,
  Tag,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react'
import { useLegalModal } from '../../context/LegalModalContext'

const faqItems = [
  {
    id: 1,
    category: 'tracking',
    icon: Package,
    question: 'كيفية تتبع شحنتي ؟',
    answer:
      'يمكنك تتبع شحنتك بسهولة عبر إدخال رقم الشحنة أو بوليصة الشحن (B/L) في شريط البحث أو من خلال لوحة التحكم الخاصة بك لمتابعة مسار الشحنة وخطوات الوصول لحظة بلحظة.',
  },
  {
    id: 2,
    category: 'billing',
    icon: Tag,
    question: 'ما هي رسوم الشحن ؟',
    answer:
      'تعتمد رسوم الشحن على نوع وسيلة النقل (بحري، جوي، بري)، الوزن والحجم، ومسار الرحلة. تقدم منصة ميناء عروض أسعار تنافسية ومباشرة بدون أي رسوم خفية أو مفاجئة عند الاستلام.',
  },
  {
    id: 3,
    category: 'customs',
    icon: Clock,
    question: 'كيف أتعامل مع تأخير الشحنة والتفتيش الجمركي ؟',
    answer:
      'في حال حدوث أي تأخير ناتج عن الأحوال الجوية أو التفتيش الجمركي، يقوم فريق الدعم الفني بميناء بمتابعة الحالة فوراً وتحديث موعد الوصول المتوقع والتنسيق مع الموانئ والناقلين.',
  },
  {
    id: 4,
    category: 'support',
    icon: Headphones,
    question: 'كيفية التواصل المباشر مع فريق الدعم الفني ؟',
    answer:
      'فريق الدعم الفني متاح لخدمتك طوال أيام الأسبوع من خلال نافذة اتصل بنا، أو عبر البريد الإلكتروني support@meyna.com، أو الاتصال المباشر بالرقم المجاني 800 123 45.',
  },
  {
    id: 5,
    category: 'customs',
    icon: ClipboardList,
    question: 'ما هي المستندات المطلوبة للتخليص الجمركي ؟',
    answer:
      'تشمل المستندات الأساسية: الفاتورة التجارية، بوليصة الشحن (B/L)، قائمة التعبئة (Packing List)، وشهادة المنشأ، مع أي تصاريح إضافية حسب نوع البضائع المستوردة.',
  },
  {
    id: 6,
    category: 'billing',
    icon: CreditCard,
    question: 'ما هي طرق الدفع المعتمدة في منصة ميناء ؟',
    answer:
      'نوفر خيارات دفع رقمية آمنة تشمل التحويل البنكي المباشر، بطاقات الائتمان (Visa / Mastercard / مدى)، ونظام الدفع الآجل المعتمد للشركات المرخصة.',
  },
]

export default function HelpCenterModal({ isOpen, onClose }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { openLegalModal } = useLegalModal()

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

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  const handleCategoryClick = (category) => {
    // Filter questions inside the modal without navigating away
    setSelectedCategory((prev) => (prev === category ? null : category))
  }

  const handleContactClick = () => {
    openLegalModal('contact')
  }

  const filteredFaqs = faqItems.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            مركز المساعدة
          </h2>
        </div>

        {/* Main Content White Container (matching XD screenshot) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200/90 relative text-right space-y-6">
          
          {/* 1. Search Bar matching XD (Orange Border with Search Icon) */}
          <div className="max-w-xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="كيف يمكننا مساعدتك اليوم ؟"
                className="w-full bg-white border-2 border-[#FB8731] rounded-full py-3 pr-6 pl-14 text-sm font-semibold text-[#011222] placeholder-gray-400 focus:outline-none shadow-xs transition-all text-right"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#011222]">
                <Search className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* 2. Four Quick Categories Cards Grid (matching XD) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Card 1: الدعم الفني */}
            <div
              onClick={() => handleCategoryClick('support')}
              className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                selectedCategory === 'support'
                  ? 'bg-[#FFF8F3] border-[#FB8731] ring-2 ring-[#FB8731]/30 shadow-sm'
                  : 'bg-[#F8FAFC] hover:bg-[#FFF8F3] border-gray-200/80 hover:border-[#FB8731]/50 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6 stroke-[2]" />
              </div>
              <span className={`text-xs sm:text-sm font-bold transition-colors ${
                selectedCategory === 'support' ? 'text-[#FB8731]' : 'text-[#011222] group-hover:text-[#FB8731]'
              }`}>
                الدعم الفني
              </span>
            </div>

            {/* Card 2: التخليص الجمركي */}
            <div
              onClick={() => handleCategoryClick('customs')}
              className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                selectedCategory === 'customs'
                  ? 'bg-[#FFF8F3] border-[#FB8731] ring-2 ring-[#FB8731]/30 shadow-sm'
                  : 'bg-[#F8FAFC] hover:bg-[#FFF8F3] border-gray-200/80 hover:border-[#FB8731]/50 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6 stroke-[2]" />
              </div>
              <span className={`text-xs sm:text-sm font-bold transition-colors ${
                selectedCategory === 'customs' ? 'text-[#FB8731]' : 'text-[#011222] group-hover:text-[#FB8731]'
              }`}>
                التخليص الجمركي
              </span>
            </div>

            {/* Card 3: الدفع و الفواتير */}
            <div
              onClick={() => handleCategoryClick('billing')}
              className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                selectedCategory === 'billing'
                  ? 'bg-[#FFF8F3] border-[#FB8731] ring-2 ring-[#FB8731]/30 shadow-sm'
                  : 'bg-[#F8FAFC] hover:bg-[#FFF8F3] border-gray-200/80 hover:border-[#FB8731]/50 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 stroke-[2]" />
              </div>
              <span className={`text-xs sm:text-sm font-bold transition-colors ${
                selectedCategory === 'billing' ? 'text-[#FB8731]' : 'text-[#011222] group-hover:text-[#FB8731]'
              }`}>
                الدفع و الفواتير
              </span>
            </div>

            {/* Card 4: تتبع الشحنات */}
            <div
              onClick={() => handleCategoryClick('tracking')}
              className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                selectedCategory === 'tracking'
                  ? 'bg-[#FFF8F3] border-[#FB8731] ring-2 ring-[#FB8731]/30 shadow-sm'
                  : 'bg-[#F8FAFC] hover:bg-[#FFF8F3] border-gray-200/80 hover:border-[#FB8731]/50 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 stroke-[2]" />
              </div>
              <span className={`text-xs sm:text-sm font-bold transition-colors ${
                selectedCategory === 'tracking' ? 'text-[#FB8731]' : 'text-[#011222] group-hover:text-[#FB8731]'
              }`}>
                تتبع الشحنات
              </span>
            </div>
          </div>

          {/* 3. Section: المقالات الشائعة (FAQ Accordion) */}
          <div className="pt-2">
            <h3 className="text-lg font-black text-[#011222] mb-3 text-right">
              المقالات الشائعة
            </h3>

            <div className="space-y-2.5">
              {filteredFaqs.map((faq) => {
                const IconComponent = faq.icon
                const isExpanded = openFaq === faq.id
                return (
                  <div
                    key={faq.id}
                    className="border border-gray-200/90 rounded-2xl overflow-hidden transition-all bg-[#FCFCFD]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 flex items-center justify-between text-right cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {/* Left: Chevron Arrow */}
                      <div className="text-gray-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#FB8731]" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>

                      {/* Right: Question with Orange Icon */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#011222]">
                          {faq.question}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#FFF4EB] text-[#FB8731] flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4 stroke-[2]" />
                        </div>
                      </div>
                    </button>

                    {/* Expandable Answer */}
                    {isExpanded && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-gray-100 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 4. Orange Help / Contact Strip matching XD */}
          <div className="bg-[#FDE2CE] border border-[#FB8731]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            {/* Right: Headphones Icon + Text */}
            <div className="flex items-center gap-3.5 text-right w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-transparent border-l border-[#FB8731]/40 pl-3.5 flex items-center justify-center text-[#FB8731] shrink-0">
                <Headphones className="w-8 h-8 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-[#011222]">
                  ما زلت بحاجة إلى المساعدة؟
                </h4>
                <p className="text-xs text-[#475569] mt-0.5 font-medium">
                  تواصل معنا و فريق الدعم جاهز لمساعدتك
                </p>
              </div>
            </div>

            {/* Left: Action Button */}
            <button
              type="button"
              onClick={handleContactClick}
              className="bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold px-7 py-2.5 rounded-xl shadow-md transition-all text-sm shrink-0 cursor-pointer"
            >
              تواصل معناً
            </button>
          </div>

        </div>

        {/* Bottom Pill Bar under the box matching XD */}
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl px-6 py-3.5 flex items-center justify-between text-xs font-bold shadow-lg mt-4">
          {/* Active Tab: مركز المساعدة */}
          <div className="flex items-center gap-2">
            <span className="text-[#011222] font-bold text-xs sm:text-sm border-b-2 border-[#FB8731] pb-0.5">
              مركز المساعدة
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
