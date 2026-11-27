import { Link } from 'react-router-dom'
import ImporterSidebar from '../../../components/dashboard/ImporterSidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import {
  DollarSign,
  Clock,
  Package,
  Users,
  TrendingUp,
  Bell,
  PlusCircle,
  Sparkles
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const monthlySpendingData = [
  { month: 'يناير', spending: 155 },
  { month: 'فبراير', spending: 190 },
  { month: 'مارس', spending: 215 },
  { month: 'ابريل', spending: 210 },
  { month: 'مايو', spending: 205 },
  { month: 'يونيو', spending: 235 },
  { month: 'يوليو', spending: 260 },
  { month: 'اغسطس', spending: 278 },
]

export default function ImporterDashboard() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()

  const isDemoSarah = currentUser?.email === 'importer@meynaa.com'
  const displayName = currentUser?.fullName || (isDemoSarah ? 'سارة الزاهرني' : 'العميل العزيز')
  const displayCompany = currentUser?.companyName || currentUser?.companyProfile?.companyNameAr || (isDemoSarah ? 'مجموعة الريادة للمقاولات' : 'منشأة تجارية معتمدة')

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner (Rectangle 23 in XD) */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-20"
        aria-hidden="true"
      ></div>

      {/* Importer Sidebar matching XD */}
      <ImporterSidebar activePath="/importer" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top Dark Hero Banner - Exact SVG of Union 1 and Path 2 from Adobe XD */}
        <section className="relative w-full min-h-[220px] lg:min-h-[240px] drop-shadow-xl text-white select-none">
          {/* Background SVG carrying exact Union 1 and Path 2 curves */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1520 246"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="union1GradientImporter" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#011222" />
                <stop offset="100%" stopColor="#1C4065" />
              </linearGradient>
            </defs>

            {/* Union 1: Banner body with the wavy top-right crest */}
            <path
              d="M 35.0 245.2 C 15.7 245.2 0.0 229.5 0.0 210.2 L 0.0 73.2 C 0.0 53.9 15.7 38.2 35.0 38.2 L 911.3 38.2 C 943.8 37.5 993.9 35.9 1053.2 32.2 C 1158.6 25.8 1260.1 17.7 1260.1 17.7 L 1484.4 4.3 C 1484.4 4.3 1520.1 0.0 1519.0 35.1 C 1518.7 42.6 1518.6 54.1 1518.5 67.4 C 1518.8 69.3 1519.0 71.2 1519.0 73.2 L 1519.0 210.2 C 1519.0 229.5 1503.3 245.2 1484.0 245.2 L 35.0 245.2 Z"
              fill="url(#union1GradientImporter)"
            />

            {/* Path 2: Orange arch sweeping down from the top edge */}
            <path
              d="M 137.0 38.2 C 137.0 38.2 236.1 177.2 333.0 177.2 C 429.8 177.2 531.5 38.2 531.5 38.2 Z"
              fill="#FB8731"
            />
          </svg>

          {/* Banner Inner Content */}
          <div className="relative z-10 w-full h-full p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 pt-10">
            {/* Right Side: Title, Welcome & Notice Info */}
            <div className="flex-1 text-right space-y-2 pr-2">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">لوحة القيادة</h1>
                <p className="text-xs text-white/75 font-medium mt-0.5">نظرة شاملة على شحناتك وإنفاقك</p>
              </div>

              <div className="pt-1 space-y-1">
                <span className="text-xs font-bold text-[#FB8731] block">مرحباً بك</span>
                <div className="text-white font-bold text-base lg:text-lg">
                  {displayName} - {displayCompany}
                </div>
                {isDemoSarah ? (
                  <p className="text-xs text-white/85 flex items-center gap-1.5 flex-wrap">
                    <span>لديك 5 طلبات عروض أسعار جديدة على طلبك RFQ-2026-441-</span>
                    <Link to="/importer/rfq" className="font-bold text-[#FB8731] hover:underline">
                      راجعيها الآن
                    </Link>
                  </p>
                ) : (
                  <p className="text-xs text-white/85 flex items-center gap-1.5 flex-wrap">
                    <span>أهلاً بك في منصة ميناء! حسابك مفعّل وجاهز لبدء عمليات الاستيراد والشحن الدولي.</span>
                    <Link to="/importer/rfq" className="font-bold text-[#FB8731] hover:underline inline-flex items-center gap-1">
                      <span>ابدأ بإنشاء أول طلب تسعير (RFQ) الآن</span>
                      <span>←</span>
                    </Link>
                  </p>
                )}
              </div>
            </div>

            {/* Left Side: Notification Bell & Savings Sub-Card shifted down slightly */}
            <div className="flex items-center gap-4">
              <button
                onClick={openNotifications}
                className="w-12 h-12 rounded-2xl bg-[#05111D] border border-white/10 hover:border-[#FB8731]/40 flex items-center justify-center text-white transition-all cursor-pointer relative shadow-xl hover:bg-white/5"
                title="الإشعارات"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731] absolute top-2.5 right-2.5 ring-2 ring-[#05111D]"></span>
              </button>

              <div className="bg-[#05111D] border border-white/10 rounded-[28px] px-8 py-6 text-white flex flex-col items-center justify-center shrink-0 shadow-2xl min-w-[220px] translate-y-3 lg:translate-y-4">
                <span className="text-white/70 text-xs font-bold">
                  {isDemoSarah ? 'وفرت هذا العام' : 'الرصيد والتوفير'}
                </span>
                <span className="text-3xl font-black text-white my-1">
                  {isDemoSarah ? '$94,300' : '$0'}
                </span>
                <span className="text-white/60 text-xs font-medium">
                  {isDemoSarah ? 'مقارنة بالأسعار السوقية' : 'جاهز للبدء مع ميناء'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Stat Cards Row matching Importer XD */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 (Right): إجمالي الإنفاق */}
          <div className="bg-white rounded-[22px] p-6 shadow-xs border border-gray-100/90 flex flex-col justify-between h-[190px] relative overflow-hidden text-right">
            {/* Top Row: Dollar Icon on Green (on Right) */}
            <div className="flex items-center justify-end">
              <div className="w-10 h-10 rounded-xl bg-[#E6F9F0] flex items-center justify-center text-[#009F65]">
                <DollarSign className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Middle & Bottom Content */}
            <div className="relative z-10">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoSarah ? '$1,284,000' : '$0'}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">إجمالي الإنفاق</div>
              <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                {isDemoSarah ? 'منذ 2026' : 'لا يوجد إنفاق بعد'}
              </div>
            </div>

            {/* Decorative Soft Wave at Bottom-Left */}
            <svg
              className="absolute bottom-0 left-0 w-32 h-24 pointer-events-none"
              viewBox="0 0 140 80"
              fill="none"
            >
              <path d="M 0 0 C 25 0 40 40 75 50 C 105 60 125 70 140 80 L 0 80 Z" fill="#E8FAF0" />
              <path d="M 0 0 C 20 0 35 30 60 38 C 85 46 110 58 120 68 L 0 80 Z" fill="#D1F5E0" opacity="0.6" />
            </svg>
          </div>

          {/* Card 2: متوسط التسليم */}
          <div className="bg-white rounded-[22px] p-6 shadow-xs border border-gray-100/90 flex flex-col justify-between h-[190px] relative overflow-hidden text-right">
            {/* Top Row: Clock Icon on Blue (on Right) */}
            <div className="flex items-center justify-end">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5FE] flex items-center justify-center text-[#0284C7]">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Middle & Bottom Content */}
            <div className="relative z-10">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoSarah ? '16.4 يوم' : '-'}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">متوسط التسليم</div>
              <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                {isDemoSarah ? 'من الطلب للاستلام' : 'عند بدء أول شحنة'}
              </div>
            </div>

            {/* Decorative Soft Wave at Bottom-Left */}
            <svg
              className="absolute bottom-0 left-0 w-32 h-24 pointer-events-none"
              viewBox="0 0 140 80"
              fill="none"
            >
              <path d="M 0 0 C 25 0 40 40 75 50 C 105 60 125 70 140 80 L 0 80 Z" fill="#E8F4FD" />
              <path d="M 0 0 C 20 0 35 30 60 38 C 85 46 110 58 120 68 L 0 80 Z" fill="#D0E9FC" opacity="0.6" />
            </svg>
          </div>

          {/* Card 3: شحنات نشطة */}
          <div className="bg-white rounded-[22px] p-6 shadow-xs border border-gray-100/90 flex flex-col justify-between h-[190px] relative overflow-hidden text-right">
            {/* Top Row: Package Icon on Orange (on Right) */}
            <div className="flex items-center justify-end">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] flex items-center justify-center text-[#FB8731]">
                <Package className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Middle & Bottom Content */}
            <div className="relative z-10">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoSarah ? '12' : '0'}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">شحنات نشطة</div>
              <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                {isDemoSarah ? 'قيد التنفيذ حالياً' : 'ابدأ أول شحنة الآن'}
              </div>
            </div>

            {/* Decorative Soft Wave at Bottom-Left */}
            <svg
              className="absolute bottom-0 left-0 w-32 h-24 pointer-events-none"
              viewBox="0 0 140 80"
              fill="none"
            >
              <path d="M 0 0 C 25 0 40 40 75 50 C 105 60 125 70 140 80 L 0 80 Z" fill="#FFF2E5" />
              <path d="M 0 0 C 20 0 35 30 60 38 C 85 46 110 58 120 68 L 0 80 Z" fill="#FFE4CC" opacity="0.6" />
            </svg>
          </div>

          {/* Card 4: شركاء موثوقون */}
          <div className="bg-white rounded-[22px] p-6 shadow-xs border border-gray-100/90 flex flex-col justify-between h-[190px] relative overflow-hidden text-right">
            {/* Top Row: Users Icon on Purple (on Right) */}
            <div className="flex items-center justify-end">
              <div className="w-10 h-10 rounded-xl bg-[#F6EEFD] flex items-center justify-center text-[#8B5CF6]">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Middle & Bottom Content */}
            <div className="relative z-10">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoSarah ? '8' : '+50'}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">شركاء موثوقون</div>
              <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                {isDemoSarah ? 'مزود خدمة معتمد' : 'مزود خدمة جاهزون لخدمتك'}
              </div>
            </div>

            {/* Decorative Soft Wave at Bottom-Left */}
            <svg
              className="absolute bottom-0 left-0 w-32 h-24 pointer-events-none"
              viewBox="0 0 140 80"
              fill="none"
            >
              <path d="M 0 0 C 25 0 40 40 75 50 C 105 60 125 70 140 80 L 0 80 Z" fill="#F5ECFD" />
              <path d="M 0 0 C 20 0 35 30 60 38 C 85 46 110 58 120 68 L 0 80 Z" fill="#EADAFA" opacity="0.6" />
            </svg>
          </div>
        </section>

        {/* Bottom Section: Monthly Spending Chart (Right) & Shipment Summary (Left) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Right Card: الإنفاق الشهري (Monthly Spending) */}
          <div className="bg-white rounded-[24px] p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {/* Left Pill */}
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${isDemoSarah ? 'bg-[#E8FAF0] text-[#009F65]' : 'bg-[#FFF7ED] text-[#FB8731]'}`}>
                {isDemoSarah ? '2026' : 'حساب جديد'}
              </span>

              {/* Right: Title + Orange Trend Icon */}
              <div className="flex items-center gap-2">
                <h3 className="text-base lg:text-lg font-bold text-[#011222]">الإنفاق الشهري</h3>
                <div className="w-7 h-7 rounded-lg border border-[#FB8731]/40 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Content: Chart for Sarah, Onboarding State for New User */}
            {isDemoSarah ? (
              <div className="w-full h-[240px] mt-2" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySpendingData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="importerOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FB8731" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#FB8731" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                    />
                    <YAxis
                      domain={[0, 320]}
                      ticks={[0, 80, 160, 240, 320]}
                      tickFormatter={(v) => `$${v}K`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      formatter={(val) => [`$${val},000`, 'الإنفاق']}
                      contentStyle={{
                        backgroundColor: '#011222',
                        borderColor: '#011222',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="spending"
                      stroke="#FB8731"
                      strokeWidth={3}
                      fill="url(#importerOrangeGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center text-center p-6 bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4EB] flex items-center justify-center text-[#FB8731] mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#011222]">لا توجد حركات إنفاق مسجلة حتى الآن</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">ستظهر إحصائياتك ومخطط الإنفاق الشهري فور ترسية أول طلب تسعير وتأكيد الشحنة.</p>
                <Link
                  to="/importer/rfq"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FB8731] text-white text-xs font-bold rounded-xl hover:bg-[#e07220] transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>طلب تسعير جديد</span>
                </Link>
              </div>
            )}
          </div>

          {/* Left Card: مخلص الشحنات (Shipment Summary) */}
          <div className="bg-white rounded-[24px] p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-end mb-4">
              <h3 className="text-base lg:text-lg font-bold text-[#011222]">مخلص الشحنات</h3>
            </div>

            {/* 4 Big Metric Boxes in a 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              {/* Top-Right: 12 في الطريق (Peach / Light Orange) */}
              <div className="bg-[#FFF3EA] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl lg:text-4xl font-black text-[#FB8731] leading-tight">
                  {isDemoSarah ? '12' : '0'}
                </span>
                <span className="text-sm font-bold text-[#475569] mt-1">
                  في الطريق
                </span>
              </div>

              {/* Top-Left: 3 طلبات مفتوحة (Light Blue) */}
              <div className="bg-[#EBF5FE] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl lg:text-4xl font-black text-[#0284C7] leading-tight">
                  {isDemoSarah ? '3' : '0'}
                </span>
                <span className="text-sm font-bold text-[#475569] mt-1">
                  طلبات مفتوحة
                </span>
              </div>

              {/* Bottom-Right: 97,2% رضا الخدمة (Light Lavender / Purple) */}
              <div className="bg-[#F3ECFD] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl lg:text-4xl font-black text-[#8B5CF6] leading-tight">
                  {isDemoSarah ? '97,2%' : '100%'}
                </span>
                <span className="text-sm font-bold text-[#475569] mt-1">
                  {isDemoSarah ? 'رضا الخدمة' : 'جاهزية الحساب'}
                </span>
              </div>

              {/* Bottom-Left: $94,300 واردات 2026 (Light Mint / Green) */}
              <div className="bg-[#E6F9F0] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl lg:text-4xl font-black text-[#009F65] leading-tight">
                  {isDemoSarah ? '$94,300' : '$0'}
                </span>
                <span className="text-sm font-bold text-[#475569] mt-1">
                  {isDemoSarah ? 'واردات 2026' : 'واردات سابقة'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Moving Footer Bar */}
        <DashboardFooterBar />

        {/* Bottom 4 Orange Dots on Left */}
        <div className="w-full pt-3 clearfix" style={{ direction: 'ltr', textAlign: 'left' }}>
          <div className="flex items-center gap-2" style={{ float: 'left', direction: 'ltr' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
          </div>
        </div>
      </main>
    </div>
  )
}
