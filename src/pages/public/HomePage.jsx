import { useState } from 'react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Link } from 'react-router-dom'
import {
  Globe,
  Ship,
  Sparkles,
  ShieldCheck,
  Plane,
  Truck,
  Calculator,
  Search,
  CheckCircle,
  XCircle,
  Building2,
  Clock,
  Star,
  Layers,
  ChevronLeft,
  Anchor,
  FileCheck,
  TrendingUp,
  DollarSign,
  CreditCard
} from 'lucide-react'

// Routes & estimates for the instant calculator
const routesData = {
  sea: {
    origins: [
      { id: 'sha', name: 'ميناء شنغهاي - الصين' },
      { id: 'ningbo', name: 'ميناء نينغبو - الصين' },
      { id: 'rot', name: 'ميناء روتردام - هولندا' },
      { id: 'dxb', name: 'ميناء جبل علي - الإمارات' },
    ],
    destinations: [
      { id: 'jed', name: 'ميناء جدة الإسلامي - السعودية' },
      { id: 'dmm', name: 'ميناء الملك عبد العزيز - الدمام' },
      { id: 'kac', name: 'ميناء الملك عبد الله - رابغ' },
      { id: 'sal', name: 'ميناء صلالة - سلطنة عُمان' },
    ],
    loads: [
      { id: 'fcl20', label: 'حاوية 20 قدم (FCL Standard)', base: 1950, time: '18 - 22 يوماً' },
      { id: 'fcl40', label: 'حاوية 40 قدم (FCL High Cube)', base: 2850, time: '18 - 22 يوماً' },
      { id: 'lcl', label: 'شحن جزئي LCL (لكل CBM)', base: 180, time: '22 - 26 يوماً' },
    ],
  },
  air: {
    origins: [
      { id: 'can', name: 'مطار غوانزو الدولي - الصين' },
      { id: 'fra', name: 'مطار فرانكفورت - ألمانيا' },
      { id: 'dxb_air', name: 'مطار دبي الدولي - الإمارات' },
      { id: 'ist', name: 'مطار إسطنبول - تركيا' },
    ],
    destinations: [
      { id: 'ruh', name: 'مطار الملك خالد الدولي - الرياض' },
      { id: 'jed_air', name: 'مطار الملك عبد العزيز الدولي - جدة' },
      { id: 'dmm_air', name: 'مطار الملك فهد الدولي - الدمام' },
    ],
    loads: [
      { id: 'air_exp', label: 'شحن جوي سريع (Cargo Express)', base: 1450, time: '2 - 4 أيام' },
      { id: 'air_eco', label: 'شحن جوي اقتصادي (Standard Cargo)', base: 920, time: '5 - 7 أيام' },
    ],
  },
  land: {
    origins: [
      { id: 'dxb_land', name: 'المنطقة الحرة جبل علي - دبي' },
      { id: 'ruh_land', name: 'المدينة الصناعية الثانية - الرياض' },
      { id: 'kwt_land', name: 'منطقة الشويخ - الكويت' },
      { id: 'amm_land', name: 'منطقة سحاب الصناعية - عمّان' },
    ],
    destinations: [
      { id: 'ruh_dest', name: 'الرياض - المستودعات المركزية' },
      { id: 'jed_dest', name: 'جدة - مستودعات الخمرة' },
      { id: 'dmm_dest', name: 'الدمام - المدينة الصناعية' },
    ],
    loads: [
      { id: 'truck_full', label: 'شاحنة ستارة كاملة (TIR Curtain)', base: 850, time: '2 - 3 أيام' },
      { id: 'truck_reefer', label: 'شاحنة مبردة للمواد الحساسة', base: 1350, time: '2 - 3 أيام' },
    ],
  },
}

export default function HomePage() {
  // Calculator state
  const [calcMode, setCalcMode] = useState('sea') // 'sea' | 'air' | 'land'
  const [origin, setOrigin] = useState('sha')
  const [dest, setDest] = useState('jed')
  const [loadType, setLoadType] = useState('fcl20')

  // Change mode helper
  const handleModeChange = (mode) => {
    setCalcMode(mode)
    const data = routesData[mode]
    setOrigin(data.origins[0].id)
    setDest(data.destinations[0].id)
    setLoadType(data.loads[0].id)
  }

  // Current selected load details
  const currentData = routesData[calcMode]
  const selectedLoad = currentData.loads.find((l) => l.id === loadType) || currentData.loads[0]
  const currentOriginName = currentData.origins.find((o) => o.id === origin)?.name || currentData.origins[0].name
  const currentDestName = currentData.destinations.find((d) => d.id === dest)?.name || currentData.destinations[0].name

  return (
    <div className="min-h-screen font-almarai bg-[#F0F3F8]" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#011222]">
        {/* Full Vibrant Hero Background image from XD */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.png"
            alt="ميناء للوجستيات"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient to make text pop on the right while preserving the vibrant scene */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Container - Aligned firmly to the RIGHT side */}
        <div className="relative z-10 max-w-[1500px] w-full mx-auto px-6 md:px-14 pt-36 md:pt-40 lg:pt-44 flex flex-col items-start text-right">
          <div className="w-full max-w-2xl text-right flex flex-col items-start mr-0 ml-auto self-start">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-[#011222]/80 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-medium px-5 py-2 rounded-full mb-6 shadow-lg">
              <span>منصة اللوجستيات الرقمية الأولى في المنطقة العربية</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08] mb-6 drop-shadow-md text-right w-full">
              شحنتك من أي مكان <br />
              <span className="text-[#FB8731] font-black inline-block mt-2">
                إلى أي مكان
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/90 text-base md:text-lg lg:text-xl font-normal leading-relaxed mb-10 max-w-xl drop-shadow-sm text-right">
              ميناء تربطك بأفضل مزودي خدمات الشحن البحري والجوي والبري في المنطقة. احصل على عروض أسعار متعددة في ساعات، واختر الأفضل بثقة وشفافية كاملة.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-start gap-4 w-full">
              <Link
                to="/register"
                className="bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold text-base md:text-lg px-9 py-4 rounded-full transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                ابدأ مجاناً الآن
              </Link>
              <Link
                to="/services"
                className="bg-[#051322]/85 hover:bg-[#081a2e] text-white font-bold text-base md:text-lg px-9 py-4 rounded-full transition-all border border-white/20 backdrop-blur-xs hover:border-white/40 hover:-translate-y-0.5"
              >
                اعرف أكثر
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Animation Keyframes */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes meynaCardFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }
          .floating-card-1 {
            animation: meynaCardFloat 4.4s ease-in-out infinite 0s;
          }
          .floating-card-2 {
            animation: meynaCardFloat 4.4s ease-in-out infinite 0.7s;
          }
          .floating-card-3 {
            animation: meynaCardFloat 4.4s ease-in-out infinite 1.4s;
          }
          .floating-card-4 {
            animation: meynaCardFloat 4.4s ease-in-out infinite 2.1s;
          }
        ` }} />

        {/* Separate Modern Square Stats Cards with Subtle Floating Animation */}
        <div className="relative z-10 w-full pb-10 pt-4">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Square Card 1: دولة مغطاة */}
              <div className="floating-card-1 bg-[#051322]/90 hover:bg-[#081a2e] backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 aspect-square max-h-[175px] sm:max-h-[195px] flex flex-col items-center justify-center text-center shadow-xl hover:border-[#FB8731]/50 hover:!translate-y-[-10px] transition-all duration-300 group cursor-default">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FB8731] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#FB8731] group-hover:text-white transition-all shadow-sm">
                  <Globe className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#FB8731] transition-colors" dir="ltr">
                  +150
                </span>
                <span className="text-xs sm:text-sm text-gray-300 font-bold mt-1">
                  دولة مغطاة
                </span>
              </div>

              {/* Square Card 2: مزود خدمة موثوق */}
              <div className="floating-card-2 bg-[#051322]/90 hover:bg-[#081a2e] backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 aspect-square max-h-[175px] sm:max-h-[195px] flex flex-col items-center justify-center text-center shadow-xl hover:border-[#FB8731]/50 hover:!translate-y-[-10px] transition-all duration-300 group cursor-default">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FB8731] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#FB8731] group-hover:text-white transition-all shadow-sm">
                  <Building2 className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#FB8731] transition-colors" dir="ltr">
                  +340
                </span>
                <span className="text-xs sm:text-sm text-gray-300 font-bold mt-1">
                  مزود خدمة موثوق
                </span>
              </div>

              {/* Square Card 3: شحنة شهرياً */}
              <div className="floating-card-3 bg-[#051322]/90 hover:bg-[#081a2e] backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 aspect-square max-h-[175px] sm:max-h-[195px] flex flex-col items-center justify-center text-center shadow-xl hover:border-[#FB8731]/50 hover:!translate-y-[-10px] transition-all duration-300 group cursor-default">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FB8731] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#FB8731] group-hover:text-white transition-all shadow-sm">
                  <Ship className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#FB8731] transition-colors" dir="ltr">
                  +2,899
                </span>
                <span className="text-xs sm:text-sm text-gray-300 font-bold mt-1">
                  شحنة شهرياً
                </span>
              </div>

              {/* Square Card 4: معدل رضا العملاء */}
              <div className="floating-card-4 bg-[#051322]/90 hover:bg-[#081a2e] backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 aspect-square max-h-[175px] sm:max-h-[195px] flex flex-col items-center justify-center text-center shadow-xl hover:border-[#FB8731]/50 hover:!translate-y-[-10px] transition-all duration-300 group cursor-default">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FB8731] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#FB8731] group-hover:text-white transition-all shadow-sm">
                  <TrendingUp className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#FB8731] transition-colors" dir="ltr">
                  97%
                </span>
                <span className="text-xs sm:text-sm text-gray-300 font-bold mt-1">
                  معدل رضا العملاء
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1️⃣ SECTION: كيف تعمل ميناء؟ (How It Works) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FB8731]/10 text-[#FB8731] border border-[#FB8731]/30 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              <Layers className="w-4 h-4" />
              <span>كيف تعمل ميناء؟</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#011222] mb-4">
              رحلة شحنتك من البداية وحتى الوصول في <span className="text-[#FB8731]">3 خطوات</span>
            </h2>
            <p className="text-[#64748B] text-base sm:text-lg">
              صممنا تجربة شحن رقمية بسيطة تخلصك من التعقيدات والمكالمات الهاتفية المتكررة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-8 relative flex flex-col justify-between hover:border-[#FB8731]/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#FB8731]/15 text-[#FB8731] flex items-center justify-center font-black group-hover:bg-[#FB8731] group-hover:text-white transition-all shadow-sm">
                    <Search className="w-7 h-7 stroke-[2]" />
                  </div>
                  <span className="text-4xl font-black text-gray-200 group-hover:text-[#FB8731]/30 transition-colors">
                    01
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#011222] mb-3">
                  حدد تفاصيل ومسار شحنتك
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  اختر وسيلة الشحن (بحري، جوي، أو بري)، وحدد ميناء الانطلاق وبلد الوصول ونوع البضاعة في أقل من دقيقة.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center text-xs font-bold text-[#FB8731]">
                <span>إدخال فوري بدون أوراق</span>
                <ChevronLeft className="w-4 h-4 mr-1" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-8 relative flex flex-col justify-between hover:border-[#FB8731]/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#011222]/10 text-[#011222] flex items-center justify-center font-black group-hover:bg-[#011222] group-hover:text-white transition-all shadow-sm">
                    <TrendingUp className="w-7 h-7 stroke-[2]" />
                  </div>
                  <span className="text-4xl font-black text-gray-200 group-hover:text-[#011222]/30 transition-colors">
                    02
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#011222] mb-3">
                  قارن واختر أفضل عرض
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  تصلك عروض أسعار موثوقة ومباشرة من أفضل شركات النقل والخطوط الملاحية المعتمدة لاختيار الأنسب لميزانيتك.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center text-xs font-bold text-[#011222]">
                <span>شفافية كاملة في التكلفة</span>
                <ChevronLeft className="w-4 h-4 mr-1" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-8 relative flex flex-col justify-between hover:border-[#FB8731]/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#009F65]/15 text-[#009F65] flex items-center justify-center font-black group-hover:bg-[#009F65] group-hover:text-white transition-all shadow-sm">
                    <ShieldCheck className="w-7 h-7 stroke-[2]" />
                  </div>
                  <span className="text-4xl font-black text-gray-200 group-hover:text-[#009F65]/30 transition-colors">
                    03
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#011222] mb-3">
                  وثّق المعاملة واستلم بأمان
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  أنهِ إجراءاتك إلكترونياً، مع أرشفة الوثائق والفسح الجمركي السريع وضمان وصول الشحنة لمستودعك باحترافية.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center text-xs font-bold text-[#009F65]">
                <span>تسليم مؤكد ومضمون 100%</span>
                <ChevronLeft className="w-4 h-4 mr-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ SECTION: حاسبة الشحن الفورية التفاعلية (Instant Freight Cost Estimator) */}
      <section className="py-24 bg-[#F0F3F8] relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FB8731]/10 text-[#FB8731] border border-[#FB8731]/30 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-3">
              <Calculator className="w-4 h-4" />
              <span>حاسبة الشحن الذكية</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#011222] mb-3">
              احسب التكلفة والوقت التقريبي لشحنتك
            </h2>
            <p className="text-[#64748B] text-base">
              اختر نوع الشحن والمسار للحصول على تقدير فوري ومباشر للتكاليف وأوقات العبور
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/90 p-6 md:p-10 max-w-5xl mx-auto">
            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-3 p-1.5 bg-[#F0F3F8] rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => handleModeChange('sea')}
                className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
                  calcMode === 'sea'
                    ? 'bg-[#011222] text-white shadow-md'
                    : 'text-[#64748B] hover:text-[#011222]'
                }`}
              >
                <Ship className="w-5 h-5" />
                <span>شحن بحري</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('air')}
                className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
                  calcMode === 'air'
                    ? 'bg-[#011222] text-white shadow-md'
                    : 'text-[#64748B] hover:text-[#011222]'
                }`}
              >
                <Plane className="w-5 h-5" />
                <span>شحن جوي</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('land')}
                className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
                  calcMode === 'land'
                    ? 'bg-[#011222] text-white shadow-md'
                    : 'text-[#64748B] hover:text-[#011222]'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span>شحن بري</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Origin */}
              <div>
                <label className="block text-xs font-bold text-[#011222] mb-2">
                  نقطة / ميناء الانطلاق
                </label>
                <div className="relative">
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#011222] focus:outline-none focus:border-[#FB8731] transition-colors"
                  >
                    {currentData.origins.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-[#011222] mb-2">
                  نقطة / ميناء الوصول
                </label>
                <div className="relative">
                  <select
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#011222] focus:outline-none focus:border-[#FB8731] transition-colors"
                  >
                    {currentData.destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Load Type */}
              <div>
                <label className="block text-xs font-bold text-[#011222] mb-2">
                  نوع وحجم الحمولة
                </label>
                <div className="relative">
                  <select
                    value={loadType}
                    onChange={(e) => setLoadType(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#011222] focus:outline-none focus:border-[#FB8731] transition-colors"
                  >
                    {currentData.loads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Output Calculation Result Box */}
            <div className="bg-[#011222] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-lg">
              <div className="space-y-2 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#FB8731] text-xs font-bold">
                  <Clock className="w-4 h-4" />
                  <span>المدة المتوقعة للعبور: {selectedLoad.time}</span>
                </div>
                <div className="text-sm text-gray-300">
                  المسار المختار: <strong className="text-white">{currentOriginName}</strong> ➔ <strong className="text-white">{currentDestName}</strong>
                </div>
                <div className="text-xs text-gray-400">
                  * التقدير يشمل أجور النقل الأساسية بناءً على متوسط أسعار السوق الحالية
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 shrink-0">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-gray-400 block mb-1">التكلفة التقديرية</span>
                  <div className="text-3xl sm:text-4xl font-black text-[#FB8731]" dir="ltr">
                    ${selectedLoad.base.toLocaleString()} - ${(selectedLoad.base * 1.25).toFixed(0).toLocaleString()}
                  </div>
                </div>
                <Link
                  to="/register"
                  className="bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-md text-sm whitespace-nowrap"
                >
                  طلب عرض سعر رسمي
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ SECTION: ميزات المنصة والتقنية الذكية (Smart Platform Features - بدون تتبع GPS) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FB8731]/10 text-[#FB8731] border border-[#FB8731]/30 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-4 h-4" />
              <span>التقنية والابتكار</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#011222] mb-4">
              منظومة تقنية متكاملة تدير شحناتك باحتراف
            </h2>
            <p className="text-[#64748B] text-base sm:text-lg">
              أدوات رقمية ذكية صُممت خصيصاً للتجار، المستوردين، ومديري سلاسل الإمداد
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: أرشفة الوثائق الجمركية */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-7 hover:border-[#FB8731]/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FB8731]/10 text-[#FB8731] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#FB8731] group-hover:text-white transition-all shadow-xs">
                <FileCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#011222] mb-2.5">
                أرشفة الوثائق الجمركية رقمياً
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed">
                رفع وحفظ بوالص الشحن، الفواتير التجارية، وشهادات المنشأ في بيئة سحابية آمنة تمنع فقدان الأوراق وتسرّع الفسح.
              </p>
            </div>

            {/* Feature 2: تسعير ذكي ومقارنة فورية */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-7 hover:border-[#FB8731]/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#011222]/10 text-[#011222] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#011222] group-hover:text-white transition-all shadow-xs">
                <DollarSign className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#011222] mb-2.5">
                عروض أسعار فورية ومقارنة ذكية
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed">
                استعراض ومقارنة عروض الأسعار من أبرز خطوط النقل العالمية والمحلية في منصة موحدة بنقرة زر ودون وسطاء.
              </p>
            </div>

            {/* Feature 3: مدفوعات آمنة وضمان كامل */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-7 hover:border-[#FB8731]/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#009F65]/10 text-[#009F65] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#009F65] group-hover:text-white transition-all shadow-xs">
                <CreditCard className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#011222] mb-2.5">
                منظومة مدفوعات وضمان مالي
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed">
                معاملات مالية محمية ونظام دفع موثوق يضمن حقوق المستورد ومزود الخدمة حتى تأكيد استلام الشحنة بسلامة.
              </p>
            </div>

            {/* Feature 4: لوحة تحكم إدارية وتقارير أداء */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-7 hover:border-[#FB8731]/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                <Building2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#011222] mb-2.5">
                لوحة تحكم إدارية وتقارير شاملة
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed">
                متابعة تقارير المصروفات اللوجستية، إدارة الموردين، وتحليل كفاءة أوقات الشحن من مكان واحد بدقة عالية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ SECTION: مقارنة ذكية: الشحن التقليدي vs الشحن عبر ميناء */}
      <section className="py-24 bg-[#F8FAFC] border-y border-gray-200/80 relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FB8731]/10 text-[#FB8731] border border-[#FB8731]/30 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>مقارنة القيمة</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#011222] mb-4">
              لماذا يفضل كبار المستوردين الشحن عبر ميناء؟
            </h2>
            <p className="text-[#64748B] text-base sm:text-lg">
              فارق واضح بين الطرق التقليدية المتعبة وبين بيئة العمل الرقمية الحديثة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Logistics (Red / Muted) */}
            <div className="bg-white border-2 border-red-200 rounded-3xl p-8 sm:p-10 shadow-sm relative">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 font-bold text-xs px-3.5 py-1.5 rounded-full mb-6">
                <XCircle className="w-4 h-4" />
                <span>الشحن التقليدي (سابقاً)</span>
              </div>
              <h3 className="text-2xl font-black text-[#011222] mb-6">
                معاملات بطيئة ومخاطر غير متوقعة
              </h3>

              <div className="space-y-4">
                {[
                  'عشرات الاتصالات الهاتفية والرسائل المشتتة مع وسطاء متعددين',
                  'أسعار غير ثابتة وتفاجؤ بتكاليف ورسوم إضافية عند وصول البضاعة',
                  'فواتير ومستندات ورقية معرضة للتلف والضياع وتأخير الفسح الجمركي',
                  'صعوبة المقارنة بين عروض الأسعار والاعتماد على خيارات محدودة',
                  'غياب الدعم المباشر وترك العميل بمفرده لمواجهة أي تعطل ملاحي',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-[#64748B] text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Meynaa Logistics (Navy / Green / Orange) */}
            <div className="bg-gradient-to-br from-[#011222] to-[#051a30] text-white border-2 border-[#FB8731]/40 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-[#FB8731]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="inline-flex items-center gap-2 bg-[#FB8731] text-white font-bold text-xs px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
                <CheckCircle className="w-4 h-4" />
                <span>مع منصة ميناء الذكية</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-6">
                تحكم كامل وشفافية وسرعة قياسية
              </h3>

              <div className="space-y-4 relative z-10">
                {[
                  'منصة رقمية موحدة تجمع كافة خدمات النقل البحري، الجوي، والبري',
                  'أسعار شفافة 100% ومضمونة من المصدر دون أي رسوم خفية مفاجئة',
                  'أرشفة سحابية لكافة الوثائق الرسمية وتنسيق سريع للفسح الجمركي',
                  'مقارنة ذكية وفورية بين عروض الخطوط الملاحية والناقلين المعتمدين',
                  'فريق دعم لوجستي متخصص يرافقك خطوة بخطوة ويحل أي عقبة 24/7',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#009F65] shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm leading-relaxed font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ SECTION: خريطة المسارات والربط التجاري الدولي (Global Trade Routes) */}
      <section className="py-24 bg-[#011222] text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FB8731]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#FB8731] border border-white/15 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-3 backdrop-blur-xs">
              <Globe className="w-4 h-4" />
              <span>شبكة الربط الدولي</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              نربط الموانئ العربية بمراكز التجارة العالمية
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              شبكة خطوط بحرية وجوية وبرية تصلك بأهم الموانئ والأسواق الصناعية والتجارية حول العالم
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Hub 1: Red Sea & Saudi Ports */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:border-[#FB8731]/40 transition-colors backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FB8731] text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                <Anchor className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">موانئ البحر الأحمر والخليج العربي</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                تغطية مباشرة لميناء جدة الإسلامي، ميناء الملك عبد الله، وميناء الملك عبد العزيز بالدمام لضمان سهولة النفاذ للسوق السعودي.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold text-[#FB8731]">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">جدة</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">الدمام</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">رابغ</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">جبل علي</span>
              </div>
            </div>

            {/* Hub 2: Far East & Asia */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:border-[#FB8731]/40 transition-colors backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                <Ship className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">خطوط آسيا والشرق الأقصى</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                رحلات أسبوعية منتظمة من موانئ شنغهاي، نينغبو، شنجن، وسنغافورة لنقل الحاويات والبضائع العامة بأفضل أسعار السوق.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold text-blue-400">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">Shanghai</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">Ningbo</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">Singapore</span>
              </div>
            </div>

            {/* Hub 3: Europe & North America */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:border-[#FB8731]/40 transition-colors backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-[#009F65] text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                <Globe className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">خطوط أوروبا وشمال الأطلسي</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                ربط ملاحي وجوي سريع مع روتردام، هامبورغ، أنتويرب، والموانئ الإيطالية لتوريد المعدات والمنتجات الأوروبية عالية الجودة.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold text-emerald-400">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">Rotterdam</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">Hamburg</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">Antwerp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ SECTION: شركاء النجاح وآراء كبار العملاء (Testimonials & Trust) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FB8731]/10 text-[#FB8731] border border-[#FB8731]/30 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-3">
              <Star className="w-4 h-4 fill-[#FB8731]" />
              <span>ثقة العملاء</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#011222] mb-4">
              ماذا يقول كبار المستوردين عن منصة ميناء؟
            </h2>
            <p className="text-[#64748B] text-base sm:text-lg">
              نفخر بدعم مئات الشركات في قطاعات المقاولات، الأغذية، والتصنيع لإنجاح شحناتهم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {/* Review 1 */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#FB8731]/40 transition-all">
              <div>
                <div className="flex items-center gap-1 text-[#FB8731] mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FB8731]" />
                  ))}
                </div>
                <p className="text-[#011222] font-semibold text-sm leading-relaxed mb-6">
                  «ميناء وفرت علينا أكثر من 20% من تكاليف الشحن البحري، والأهم من ذلك وضوح الرسوم ومواعيد الفسح الجمركي بدون أي مفاجآت في التكاليف.»
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#FB8731] text-white flex items-center justify-center font-bold text-sm">
                  م
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#011222]">مجموعة الريادة للمقاولات</h4>
                  <span className="text-xs text-[#64748B]">م. عبد العزيز الشمري - مدير سلاسل الإمداد</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#FB8731]/40 transition-all">
              <div>
                <div className="flex items-center gap-1 text-[#FB8731] mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FB8731]" />
                  ))}
                </div>
                <p className="text-[#011222] font-semibold text-sm leading-relaxed mb-6">
                  «الشحن المبرد وحاويات الـ Reefer تتطلب التزاماً دقيقاً للغاية بمواعيد الوصول. مع منصة ميناء وجدنا دقة استثنائية وأسعاراً لا تضاهى.»
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#011222] text-white flex items-center justify-center font-bold text-sm">
                  ش
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#011222]">شركة النخبة للأغذية</h4>
                  <span className="text-xs text-[#64748B]">أ. طارق الغامدي - رئيس قسم الاستيراد</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#F8FAFC] border border-gray-200/90 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#FB8731]/40 transition-all">
              <div>
                <div className="flex items-center gap-1 text-[#FB8731] mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FB8731]" />
                  ))}
                </div>
                <p className="text-[#011222] font-semibold text-sm leading-relaxed mb-6">
                  «أفضل ما في المنصة هو جمع كل فواتير وبوالص الشحن في حساب واحد منظم، وفريق الدعم الفني متجاوب ومحترف جداً على مدار الساعة.»
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#009F65] text-white flex items-center justify-center font-bold text-sm">
                  ص
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#011222]">مؤسسة المشرق الصناعية</h4>
                  <span className="text-xs text-[#64748B]">م. فيصل الحربي - مدير المشتريات الدولية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-[#011222] py-20 text-center text-white relative overflow-hidden">
        <div className="max-w-[900px] mx-auto px-6 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">ابدأ رحلتك اللوجستية مع ميناء اليوم</h2>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            سجّل الآن وانضم إلى مئات الشركات التي تدير وتخفض تكاليف شحناتها اللوجستية بكل سهولة واحترافية
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-[#FB8731] hover:bg-orange-500 text-white font-bold px-9 py-4 rounded-full transition-colors text-base shadow-lg shadow-orange-500/30"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              to="/pricing"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-9 py-4 rounded-full transition-colors border border-white/20 text-base"
            >
              عرض باقات الأسعار
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
