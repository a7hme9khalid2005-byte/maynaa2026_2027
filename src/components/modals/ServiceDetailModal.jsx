import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TruckTrackingMap from '../dashboard/TruckTrackingMap'
import {
  X,
  ShieldCheck,
  Clock,
  Tag,
  Headphones,
  Laptop,
  Package,
  Truck,
  CheckCircle2,
  Check,
  Globe,
  ArrowLeft,
  ChevronDown,
  MapPin,
  RotateCw,
  Warehouse,
} from 'lucide-react'

export default function ServiceDetailModal({ isOpen, serviceKey = 'land', onClose }) {
  const navigate = useNavigate()

  // State for Air Freight instant quote calculator
  const [cargoType, setCargoType] = useState('general')
  const [cargoWeight, setCargoWeight] = useState('medium')
  const [destination, setDestination] = useState('uae')

  // State for Delivery tracking
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const isDelivery =
    serviceKey === 'delivery' ||
    serviceKey === 'التوصيل السريع' ||
    serviceKey === 'التوصيل السريع للميل الأخير' ||
    serviceKey === 'توصيل'

  const isWarehouse =
    serviceKey === 'warehouse' ||
    serviceKey === 'التخزين وإدارة المستودعات' ||
    serviceKey === 'التخزين و إدارة المستودعات' ||
    serviceKey === 'التخزين وادارة المستودعات'

  const isCustoms =
    serviceKey === 'customs' ||
    serviceKey === 'التخليص الجمركي والاستشارات' ||
    serviceKey === 'التخليص الجمركي و الاستشارات' ||
    serviceKey === 'تخليص'

  const isAir =
    serviceKey === 'air' ||
    serviceKey === 'الشحن الجوي' ||
    serviceKey === 'الشحن الجوي السريع'

  const isSea =
    serviceKey === 'sea' ||
    serviceKey === 'الشحن البحري' ||
    serviceKey === 'الشحن البحري (FCL / LCL)'

  const handleStartShipping = () => {
    onClose()
    navigate('/importer/rfq')
  }

  const handleTrackPackage = (e) => {
    e.preventDefault()
    if (!trackingCode.trim()) {
      setTrackingResult({
        found: true,
        code: 'SHN-2026-884',
        status: 'في الطريق للتسليم إلى باب العميل',
        eta: 'اليوم، 04:30 مساءً',
      })
    } else {
      setTrackingResult({
        found: true,
        code: trackingCode.toUpperCase(),
        status: 'جاري التوصيل للميل الأخير',
        eta: 'متوقع خلال ساعتين',
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#011222]/80 backdrop-blur-md overflow-y-auto animate-fade-in font-almarai"
      dir="rtl"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-[980px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-150 my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-[#FB8731] flex items-center justify-center shadow-lg border border-gray-100 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* ============================================================== */}
        {/* VIEW 1: التوصيل السريع (Express & Last Mile Delivery Modal)     */}
        {/* ============================================================== */}
        {isDelivery ? (
          <div className="flex flex-col bg-[#F8FAFC]">
            {/* 1. Hero Banner */}
            <div className="relative w-full min-h-[230px] sm:min-h-[260px] bg-[#011222] overflow-hidden flex items-center">
              <img
                src="/images/delivery-freight-hero.png"
                alt="التوصيل السريع"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#011222]/90 via-[#011222]/70 to-[#011222]/40" />

              <div className="relative z-10 w-full px-6 sm:px-10 py-8 flex flex-col items-start text-right">
                <div className="inline-block">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FB8731] tracking-tight">
                    التوصيل السريع
                  </h2>
                  <div className="h-1.5 w-28 bg-[#FB8731] rounded-full mt-2 shadow-xs"></div>
                </div>

                <p className="mt-2 text-white/95 text-xs sm:text-sm md:text-base font-bold leading-relaxed max-w-xl text-shadow-sm">
                  لأن وقتك يهمنا - حلول توصيل موثوقة إلى باب العميل مباشرة
                </p>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {[
                    'توصيل سريع و آمن',
                    'متابعة مستمرة',
                    'توصيل لجميع المناطق',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full text-white text-xs font-bold"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const trackInput = document.getElementById('tracking-input-box')
                    if (trackInput) trackInput.focus()
                  }}
                  className="mt-4 bg-[#FB8731] hover:bg-[#e07525] active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  <span>تتبع شحنتك الآن</span>
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* 2. Middle Section: تتبع شحنتك بسهولة + صورة التسليم عند الباب */}
            <div className="px-5 sm:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Left: تتبع شحنتك بسهولة Widget */}
                <div className="md:col-span-7 order-2 md:order-1">
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm text-right">
                    <h3 className="text-base sm:text-lg font-black text-[#011222] mb-1">
                      تتبع شحنتك بسهولة
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mb-3">
                      أدخل رقم التتبع للاطلاع على الحالة الفورية للشحنة
                    </p>

                    {/* Tracking Form */}
                    <form onSubmit={handleTrackPackage} className="relative flex items-center">
                      <input
                        id="tracking-input-box"
                        type="text"
                        placeholder="أدخل رقم شحنتك (مثال: SHN-2026-884)"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-3 px-4 pl-24 text-xs font-bold text-[#011222] placeholder:text-gray-400 text-right focus:bg-white focus:outline-none focus:border-[#FB8731] focus:ring-2 focus:ring-[#FB8731]/15 transition-all shadow-xs"
                      />
                      <button
                        type="submit"
                        className="absolute left-1.5 bg-[#FB8731] hover:bg-[#e07525] text-white text-xs font-black px-6 py-2 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        بحث
                      </button>
                    </form>

                    {/* Live Tracking Result Banner */}
                    {trackingResult && (
                      <div className="mt-3 bg-[#D0FAE4]/50 rounded-xl p-3.5 border border-[#009F65]/30 flex items-center justify-between text-xs animate-fade-in">
                        <div className="flex items-center gap-2.5 text-right">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#009F65] animate-pulse"></span>
                          <span className="font-black text-[#011222]">
                            {trackingResult.code}: {trackingResult.status}
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-[#009F65]">
                          {trackingResult.eta}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Doorstep Delivery Photo */}
                <div className="md:col-span-5 order-1 md:order-2">
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white h-[135px] sm:h-[155px]">
                    <img
                      src="/images/delivery-doorstep.png"
                      alt="تسليم الشحنة للعميل عند الباب"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Bottom Features */}
            <div className="px-5 sm:px-8 pb-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Card 1: متابعة فورية */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs transition-all hover:border-[#FB8731]/30 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                    <MapPin className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-[#011222]">
                    متابعة فورية
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                    تحديث لحظي لحركة السائق
                  </span>
                </div>

                {/* Card 2: أمان و موثوقية عامة */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs transition-all hover:border-[#FB8731]/30 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-[#011222]">
                    أمان و موثوقية عامة
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                    ضمان سلامة الطرود 100%
                  </span>
                </div>

                {/* Card 3: سرعة في التسليم */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs transition-all hover:border-[#FB8731]/30 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                    <Clock className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-[#011222]">
                    سرعة في التسليم
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                    توصيل في نفس اليوم
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : isWarehouse ? (
          /* ============================================================== */
          /* VIEW 2: التخزين وإدارة المستودعات (Warehouse & Storage Modal)     */
          /* ============================================================== */
          <div className="flex flex-col bg-[#F8FAFC]">
            {/* 1. Hero Banner */}
            <div className="relative w-full min-h-[230px] sm:min-h-[260px] bg-[#011222] overflow-hidden flex items-center">
              <img
                src="/images/warehouse-freight-hero.png"
                alt="التخزين وإدارة المستودعات"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#011222]/90 via-[#011222]/70 to-[#011222]/40" />

              <div className="relative z-10 w-full px-6 sm:px-10 py-8 flex flex-col items-start text-right">
                <div className="inline-block">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FB8731] tracking-tight">
                    التخزين وإدارة المستودعات
                  </h2>
                  <div className="h-1.5 w-36 bg-[#FB8731] rounded-full mt-2 shadow-xs"></div>
                </div>

                <p className="mt-2 text-white/95 text-xs sm:text-sm md:text-base font-bold leading-relaxed max-w-xl text-shadow-sm">
                  مساحات تخزين آمنة و ذكية لمنتجاتك مجهزة بأحدث تقنيات السلامة والتحكم
                </p>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {[
                    'إدارة احترافية',
                    'مراقبة مستمرة 24/7',
                    'أنظمة WMS حديثة',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full text-white text-xs font-bold"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Middle Section: قدراتنا في التخزين */}
            <div className="px-5 sm:px-8 py-6 text-center">
              <h3 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
                قدراتنا في التخزين
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 mb-5">
                مساحات تخزين واسعة ومكيفة تناسب جميع أنواع البضائع
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="bg-white hover:bg-[#FFF7ED]/30 transition-all rounded-2xl p-4.5 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs hover:border-[#FB8731]/30 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                    <MapPin className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-[#011222]">
                    مواقع استراتيجية
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                    بالقرب من الموانئ والمطارات
                  </span>
                </div>

                <div className="bg-white hover:bg-[#FFF7ED]/30 transition-all rounded-2xl p-4.5 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs hover:border-[#FB8731]/30 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-[#011222]">
                    أمان و موثوقية عامة
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                    كاميرات وحراسة مدار الساعة
                  </span>
                </div>

                <div className="bg-white hover:bg-[#FFF7ED]/30 transition-all rounded-2xl p-4.5 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs hover:border-[#FB8731]/30 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                    <RotateCw className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-[#011222]">
                    أنظمة إدارة متطورة
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                    تتبع المخزون بالباركود
                  </span>
                </div>

                <div className="bg-white hover:bg-[#FFF7ED]/30 transition-all rounded-2xl p-4.5 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs hover:border-[#FB8731]/30 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                    <Warehouse className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-sm font-black text-[#011222]" dir="ltr">
                    +50,000
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    متر مربع مساحات تخزين
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Bottom Section */}
            <div className="px-5 sm:px-8 pb-7">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7 order-2 md:order-1">
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white h-[155px] sm:h-[175px]">
                    <img
                      src="/images/warehouse-engineers.png"
                      alt="فريق إدارة المستودعات واللوجستيات"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:col-span-5 order-1 md:order-2">
                  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 text-right">
                    <h4 className="text-base sm:text-lg font-black text-[#011222]">
                      خدمات إدارة المستودعات
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5 mb-3.5">
                      حلول متكاملة لإدارة مخزونك بكفاءة و مرونة
                    </p>

                    <div className="flex flex-col gap-2.5">
                      {[
                        'إدارة المخزون والتخزين الدائم والمؤقت',
                        'الفرز والتعبئة والتجهيز للشحن',
                        'التوزيع المحلي والدولي السريع',
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 text-right"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#009F65] flex items-center justify-center text-white shrink-0 shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-xs font-bold text-[#011222]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleStartShipping}
                      className="mt-4 w-full bg-[#FB8731] hover:bg-[#e07525] active:scale-95 text-white font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                    >
                      <span>احجز مساحة تخزين الآن</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isCustoms ? (
          /* ============================================================== */
          /* VIEW 3: التخليص الجمركي والاستشارات (Customs Clearance Modal)    */
          /* ============================================================== */
          <div className="flex flex-col bg-[#F8FAFC]">
            {/* 1. Hero Banner */}
            <div className="relative w-full min-h-[230px] sm:min-h-[260px] bg-[#011222] overflow-hidden flex items-center">
              <img
                src="/images/customs-freight-hero.png"
                alt="التخليص الجمركي والاستشارات"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#011222]/90 via-[#011222]/70 to-[#011222]/40" />

              <div className="relative z-10 w-full px-6 sm:px-10 py-8 flex flex-col items-start text-right">
                <div className="inline-block">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FB8731] tracking-tight">
                    التخليص الجمركي و الاستشارات
                  </h2>
                  <div className="h-1.5 w-40 bg-[#FB8731] rounded-full mt-2 shadow-xs"></div>
                </div>

                <p className="mt-2 text-white/95 text-xs sm:text-sm md:text-base font-bold leading-relaxed max-w-xl text-shadow-sm">
                  إنهاء الإجراءات الجمركية بكل سهولة و احترافية عبر نخبة من الخبراء المعتمدين
                </p>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {[
                    'إجراءات سريعة',
                    'إستشارات متخصصة',
                    'تخليص آمن و قانوني',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full text-white text-xs font-bold"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Middle Section */}
            <div className="px-6 sm:px-10 py-8 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 order-2 md:order-1">
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white h-[165px] sm:h-[190px]">
                    <img
                      src="/images/customs-paperwork.png"
                      alt="وثائق التخليص الجمركي"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:col-span-7 order-1 md:order-2 text-right">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#011222] tracking-tight">
                    خدماتنا الجمركية
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 mb-5">
                    نقدم لك حلولاً متكاملة وسريعة لفسح البضائع دون أي تأخير
                  </p>

                  <div className="flex flex-col gap-3">
                    {[
                      'إنهاء جميع الإجراءات الجمركية في الموانئ والمطارات',
                      'الاستشارات القانونية والتجارية وتصنيف بنود التعرفة HS Code',
                      'متابعة المعاملات وإصدار أذونات التسليم حتى باب المستودع',
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs flex items-center gap-3 text-right"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#009F65] flex items-center justify-center text-white shrink-0 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#011222]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleStartShipping}
                    className="mt-5 bg-[#FB8731] hover:bg-[#e07525] active:scale-95 text-white font-black text-xs sm:text-sm px-7 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    <span>طلب تخليص جمركي الآن</span>
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : isAir ? (
          /* ============================================================== */
          /* VIEW 4: الشحن الجوي (Air Freight Modal Design)                  */
          /* ============================================================== */
          <div className="flex flex-col bg-[#F8FAFC]">
            {/* 1. Hero Banner */}
            <div className="relative w-full min-h-[230px] sm:min-h-[260px] bg-[#011222] overflow-hidden flex items-center">
              <img
                src="/images/air-freight-hero.png"
                alt="الشحن الجوي"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#011222]/90 via-[#011222]/70 to-[#011222]/40" />

              <div className="relative z-10 w-full px-6 sm:px-10 py-8 flex flex-col items-start text-right">
                <div className="inline-block">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FB8731] tracking-tight">
                    الشحن الجوي
                  </h2>
                  <div className="h-1.5 w-28 bg-[#FB8731] rounded-full mt-2 shadow-xs"></div>
                </div>

                <p className="mt-2 text-white/95 text-xs sm:text-sm md:text-base font-bold leading-relaxed max-w-xl text-shadow-sm">
                  سرعة لا مثيل لها- أوصل شحنتك في كل مكان في العالم بأعلى معايير الأمان
                </p>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {[
                    'أسرع طرق للشحن',
                    'أمان عالي للبضائع',
                    'متابعة لحظية للشحنة',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full text-white text-xs font-bold"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Middle Section */}
            <div className="px-5 sm:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 order-2 md:order-1 flex items-center justify-center">
                  <div className="w-full rounded-2xl overflow-hidden bg-white p-2 border border-gray-100 shadow-sm">
                    <img
                      src="/images/air-flight-map.png"
                      alt="خريطة مسارات الشحن الجوي العالمية"
                      className="w-full h-auto max-h-[220px] object-contain mx-auto"
                    />
                  </div>
                </div>

                <div className="md:col-span-7 order-1 md:order-2 text-right bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-black text-[#011222]">
                    احصل على سعر فوري
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5 mb-4">
                    أدخل تفاصيل شحنتك للاطلاع على تقدير التكلفة الفورية
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5 text-right">
                      <label className="block text-[11px] font-bold text-gray-600">
                        نوع الشحنة
                      </label>
                      <div className="relative">
                        <select
                          value={cargoType}
                          onChange={(e) => setCargoType(e.target.value)}
                          className="w-full appearance-none bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#011222] focus:bg-white focus:outline-none focus:border-[#FB8731] cursor-pointer"
                        >
                          <option value="general">بضائع عامة</option>
                          <option value="electronics">أجهزة إلكترونية</option>
                          <option value="pharma">مستلزمات طبية</option>
                          <option value="fragile">بضائع حساسة</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="block text-[11px] font-bold text-gray-600">
                        الوزن
                      </label>
                      <div className="relative">
                        <select
                          value={cargoWeight}
                          onChange={(e) => setCargoWeight(e.target.value)}
                          className="w-full appearance-none bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#011222] focus:bg-white focus:outline-none focus:border-[#FB8731] cursor-pointer"
                        >
                          <option value="light">أقل من 50 كجم</option>
                          <option value="medium">50 - 200 كجم</option>
                          <option value="heavy">200 - 500 كجم</option>
                          <option value="super">أكثر من 500 كجم</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="block text-[11px] font-bold text-gray-600">
                        الوجهة
                      </label>
                      <div className="relative">
                        <select
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full appearance-none bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#011222] focus:bg-white focus:outline-none focus:border-[#FB8731] cursor-pointer"
                        >
                          <option value="uae">الإمارات العربية المتحدة</option>
                          <option value="ksa">المملكة العربية السعودية</option>
                          <option value="de">ألمانيا (فرانكفورت)</option>
                          <option value="cn">الصين (شانغهاي)</option>
                          <option value="tr">تركيا (إسطنبول)</option>
                          <option value="eg">مصر (القاهرة)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFF7ED] border border-[#FB8731]/30 rounded-2xl p-3 px-4 shadow-xs">
                    <div className="text-right">
                      <span className="text-[11px] text-gray-500 block font-medium">
                        السعر التقديري للشحن الجوي:
                      </span>
                      <span className="text-sm font-black text-[#FB8731]">
                        {cargoWeight === 'light'
                          ? '$320 - $480'
                          : cargoWeight === 'medium'
                          ? '$650 - $920'
                          : cargoWeight === 'heavy'
                          ? '$1,400 - $1,850'
                          : '$2,800 - $3,900'}
                      </span>
                    </div>

                    <button
                      onClick={handleStartShipping}
                      className="bg-[#FB8731] hover:bg-[#e07525] text-white text-xs font-black px-5 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <span>تأكيد طلب العرض</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Bottom Features */}
            <div className="px-5 sm:px-8 pb-7">
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-right shrink-0">
                  <h4 className="text-base sm:text-lg font-black text-[#011222]">
                    مميزات الشحن الجوي
                  </h4>
                  <div className="h-1 w-full bg-[#FB8731] rounded-full mt-1.5"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-1.5">
                      <Globe className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-[#011222]">
                      تغطية عالمية شاملة
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-1.5">
                      <ShieldCheck className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-[#011222]">
                      أمان و موثوقية عامة
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-1.5">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-[#011222]">
                      سرعة فائقة في التسليم
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isSea ? (
          /* ============================================================== */
          /* VIEW 5: الشحن البحري (Sea Freight Modal Design)                  */
          /* ============================================================== */
          <div className="flex flex-col bg-[#F8FAFC]">
            {/* 1. Hero Banner */}
            <div className="relative w-full min-h-[230px] sm:min-h-[260px] bg-[#011222] overflow-hidden flex items-center">
              <img
                src="/images/sea-freight-hero.png"
                alt="الشحن البحري"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#011222]/90 via-[#011222]/70 to-[#011222]/40" />

              <div className="relative z-10 w-full px-6 sm:px-10 py-8 flex flex-col items-start text-right">
                <div className="inline-block">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FB8731] tracking-tight">
                    الشحن البحري
                  </h2>
                  <div className="h-1.5 w-32 bg-[#FB8731] rounded-full mt-2 shadow-xs"></div>
                </div>

                <p className="mt-2 text-white/95 text-xs sm:text-sm md:text-base font-bold leading-relaxed max-w-xl text-shadow-sm">
                  حل اقتصادي و موثوق لنقل بضائعك الضخمة عبر أكبر الموانئ العالمية
                </p>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {[
                    'أسعار تنافسية',
                    'قدرة شحن كبيرة',
                    'موانئ عالمية',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full text-white text-xs font-bold"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStartShipping}
                  className="mt-4 bg-[#FB8731] hover:bg-[#e07525] active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  <span>ابدأ الشحن البحري الآن</span>
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* 2. Middle Grid: Cranes Port + Global Route Map */}
            <div className="px-5 sm:px-8 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white h-[125px] sm:h-[150px]">
                  <img
                    src="/images/sea-port-cranes.png"
                    alt="موانئ الشحن البحري"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white flex items-center justify-center p-2 h-[125px] sm:h-[150px]">
                  <img
                    src="/images/sea-routes-map.png"
                    alt="خريطة المسارات البحرية العالمية"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* 3. Container Yard Panorama Banner */}
            <div className="px-5 sm:px-8 pb-5">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white h-[90px] sm:h-[110px]">
                <img
                  src="/images/sea-containers-yard.png"
                  alt="حاويات الشحن البحري"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 4. Bottom Features */}
            <div className="px-5 sm:px-8 pb-7">
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-right shrink-0">
                  <h4 className="text-base sm:text-lg font-black text-[#011222]">
                    مميزات الشحن البحري
                  </h4>
                  <div className="h-1 w-full bg-[#FB8731] rounded-full mt-1.5"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-1.5">
                      <Tag className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-[#011222]">
                      تكلفة اقتصادية مناسبة
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-1.5">
                      <ShieldCheck className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-[#011222]">
                      أمان و موثوقية عامة
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-1.5">
                      <Package className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-[#011222]">
                      سعة شحن ضخمة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 6: الشحن البري (Land Freight Modal Design)                 */
          /* ============================================================== */
          <div className="flex flex-col bg-[#F8FAFC]">
            {/* 1. Hero Banner */}
            <div className="relative w-full min-h-[230px] sm:min-h-[260px] bg-[#011222] overflow-hidden flex items-center">
              <img
                src="/images/service-land.png"
                alt="الشحن البري"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#011222]/90 via-[#011222]/70 to-[#011222]/40" />

              <div className="relative z-10 w-full px-6 sm:px-10 py-8 flex flex-col items-start text-right">
                <div className="inline-block">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FB8731] tracking-tight">
                    الشحن البري
                  </h2>
                  <div className="h-1.5 w-28 bg-[#FB8731] rounded-full mt-2 shadow-xs"></div>
                </div>

                <p className="mt-2 text-white/95 text-xs sm:text-sm md:text-base font-bold leading-relaxed max-w-xl text-shadow-sm">
                  حلول شحن بري موثوقة و سريعة لنقل بضائعك داخل و خارج البلاد بأمان و كفاءة عالية
                </p>

                <button
                  onClick={handleStartShipping}
                  className="mt-4 bg-[#FB8731] hover:bg-[#e07525] active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  <span>ابدأ الشحن الآن</span>
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* 2. Four Key Features Bar */}
            <div className="px-5 sm:px-8 -mt-7 sm:-mt-8 relative z-20">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 py-5 px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-x-reverse md:divide-gray-100">
                  <div className="flex flex-col items-center text-center px-3 py-1">
                    <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                      <ShieldCheck className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-[#011222]">أمان عالي</h4>
                    <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                      بضائعك في أيدي أمينة
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center px-3 py-1">
                    <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                      <Clock className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-[#011222]">سرعة في التوصيل</h4>
                    <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                      نوصل لوجهتك في الوقت المحدد
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center px-3 py-1">
                    <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                      <Tag className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-[#011222]">أسعار تنافسية</h4>
                    <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                      أفضل العروض لعملائنا
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center px-3 py-1">
                    <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#FB8731] border border-[#FB8731]/20 flex items-center justify-center mb-2 shadow-xs">
                      <Headphones className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-[#011222]">دعم مستمر</h4>
                    <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                      فريقنا معك في كل خطوة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. "كيف تعمل الخدمة ؟" Section */}
            <div className="px-5 sm:px-8 py-8 sm:py-10 pb-12">
              <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-10">
                <div className="h-1 w-16 sm:w-28 md:w-36 bg-[#FB8731] rounded-full"></div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#011222] tracking-tight whitespace-nowrap">
                  كيف تعمل الخدمة ؟
                </h3>
                <div className="h-1 w-16 sm:w-28 md:w-36 bg-[#FB8731] rounded-full"></div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2 px-2">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#FB8731] to-[#ffa352] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 mb-3 transition-transform hover:scale-105">
                    <Laptop className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h5 className="text-xs sm:text-sm font-black text-[#011222]">
                    1. قدم طلب الشحن
                  </h5>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    عبر موقعنا بسهولة
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center text-gray-300">
                  <ArrowLeft className="w-7 h-7 stroke-[1.5]" />
                </div>

                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#FB8731] to-[#ffa352] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 mb-3 transition-transform hover:scale-105">
                    <Package className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h5 className="text-xs sm:text-sm font-black text-[#011222]">
                    2. تجهيز الشحنة
                  </h5>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    وتغليفها باحترافية
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center text-gray-300">
                  <ArrowLeft className="w-7 h-7 stroke-[1.5]" />
                </div>

                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#FB8731] to-[#ffa352] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 mb-3 transition-transform hover:scale-105">
                    <Truck className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h5 className="text-xs sm:text-sm font-black text-[#011222]">
                    3. النقل البري
                  </h5>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    على أفضل الطرق
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center text-gray-300">
                  <ArrowLeft className="w-7 h-7 stroke-[1.5]" />
                </div>

                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#FB8731] to-[#ffa352] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 mb-3 transition-transform hover:scale-105">
                    <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h5 className="text-xs sm:text-sm font-black text-[#011222]">
                    4. استلام الشحنة
                  </h5>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    في وجهتها بأمان
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Live GPS Fleet Tracking Map Showcase */}
            <div className="px-5 sm:px-8 pb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <h3 className="text-lg sm:text-xl font-black text-[#011222]">
                    خريطة التتبع المباشر لأسطول الشاحنات (GPS)
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    تتبع شاحنتك لحظة بلحظة مع قراءات السرعة وحرارة المقطورة ووقت الوصول التقديري
                  </p>
                </div>
              </div>
              <TruckTrackingMap isCompact={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
