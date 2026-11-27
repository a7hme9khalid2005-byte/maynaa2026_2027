import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../../components/dashboard/Sidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import api from '../../../services/api'
import {
  DollarSign,
  FileText,
  Package,
  Award,
  Star,
  Calendar,
  TrendingUp,
  Activity,
  Bell,
  Sparkles,
  ArrowRight
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

const monthlySalesData = [
  { month: 'يناير', sales: 280 },
  { month: 'فبراير', sales: 340 },
  { month: 'مارس', sales: 370 },
  { month: 'ابريل', sales: 360 },
  { month: 'مايو', sales: 365 },
  { month: 'يونيو', sales: 420 },
  { month: 'يوليو', sales: 470 },
  { month: 'اغسطس', sales: 520 },
]

export default function Dashboard() {
  const { openNotifications } = useNotifications()
  const { user: authUser, setUser } = useAuth() || {}
  const [dbUser, setDbUser] = useState(null)
  const [liveShipmentsCount, setLiveShipmentsCount] = useState(null)
  const [liveRfqCount, setLiveRfqCount] = useState(null)

  useEffect(() => {
    // 1. قراءة بيانات مزود الخدمة من قاعدة البيانات
    authService.getProfile()
      .then((res) => {
        if (res?.data) {
          setDbUser(res.data)
          if (setUser) setUser(res.data)
        }
      })
      .catch(() => {})

    // 2. قراءة شحنات المزود من قاعدة البيانات
    api.get('/shipments')
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setLiveShipmentsCount(res.data.length)
        }
      })
      .catch(() => {})

    // 3. قراءة عروض الأسعار المتاحة في السوق
    api.get('/rfq/market')
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setLiveRfqCount(res.data.length)
        }
      })
      .catch(() => {})
  }, [setUser])

  const currentUser = dbUser || authUser || authService.getCurrentUser()
  const isDemoProvider = currentUser?.email === 'provider@meynaa.com'
  const displayName = currentUser?.fullName || (isDemoProvider ? 'خالد العمري' : 'مزود الخدمة')
  const displayCompany = currentUser?.companyName || currentUser?.companyProfile?.companyNameAr || (isDemoProvider ? 'شركة الأفق للشحن الدولي' : 'شركة خدمات لوجستية معتمدة')

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner (Rectangle 23 in XD) */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-20"
        aria-hidden="true"
      ></div>

      {/* Sidebar matching XD */}
      <Sidebar activePath="/dashboard" />

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
              <linearGradient id="union1Gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#011222" />
                <stop offset="100%" stopColor="#1C4065" />
              </linearGradient>
            </defs>

            {/* Union 1: Banner body with the wavy top-right crest */}
            <path
              d="M 35.0 245.2 C 15.7 245.2 0.0 229.5 0.0 210.2 L 0.0 73.2 C 0.0 53.9 15.7 38.2 35.0 38.2 L 911.3 38.2 C 943.8 37.5 993.9 35.9 1053.2 32.2 C 1158.6 25.8 1260.1 17.7 1260.1 17.7 L 1484.4 4.3 C 1484.4 4.3 1520.1 0.0 1519.0 35.1 C 1518.7 42.6 1518.6 54.1 1518.5 67.4 C 1518.8 69.3 1519.0 71.2 1519.0 73.2 L 1519.0 210.2 C 1519.0 229.5 1503.3 245.2 1484.0 245.2 L 35.0 245.2 Z"
              fill="url(#union1Gradient)"
            />

            {/* Path 2: Orange arch sweeping down from the top edge */}
            <path
              d="M 137.0 38.2 C 137.0 38.2 236.1 177.2 333.0 177.2 C 429.8 177.2 531.5 38.2 531.5 38.2 Z"
              fill="#FB8731"
            />
          </svg>

          {/* Banner Inner Content */}
          <div className="relative z-10 w-full h-full p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 pt-10">
            {/* Right Side: Title & Notice Info (RTL start) */}
            <div className="flex-1 text-right space-y-3.5 pr-2">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">لوحة القيادة</h1>
                <p className="text-xs text-white/75 font-medium mt-0.5">نظرة شاملة على أداء خدماتك</p>
              </div>

              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-start gap-2 text-white font-bold text-base lg:text-lg">
                  <span>{displayName} - {displayCompany}</span>
                  <span className="text-xl">🚢</span>
                </div>
                {isDemoProvider ? (
                  <p className="text-xs text-white/85 flex items-center gap-1 flex-wrap">
                    <span>لديك 5 طلبات عروض جديدة تنتظرك - </span>
                    <Link to="/dashboard/rfq" className="font-bold text-[#FB8731] hover:underline">
                      2 منها عاجلة
                    </Link>
                  </p>
                ) : (
                  <p className="text-xs text-white/85 flex items-center gap-1 flex-wrap">
                    <span>أهلاً بك في منصة ميناء كمزود خدمة معتمد! حسابك مفعل ومؤهل لتقديم عروض الأسعار.</span>
                    <Link to="/dashboard/rfq" className="font-bold text-[#FB8731] hover:underline">
                      تصفح طلبات التسعير المتاحة ←
                    </Link>
                  </p>
                )}
              </div>
            </div>

            {/* Left Side: Notification Bell & Rating Sub-Card shifted down slightly */}
            <div className="flex items-center gap-4">
              <button
                onClick={openNotifications}
                className="w-12 h-12 rounded-2xl bg-[#05111D] border border-white/10 hover:border-[#FB8731]/40 flex items-center justify-center text-white transition-all cursor-pointer relative shadow-xl hover:bg-white/5"
                title="الإشعارات"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731] absolute top-2.5 right-2.5 ring-2 ring-[#05111D]"></span>
              </button>

              <div className="bg-[#05111D] border border-white/10 rounded-[28px] px-7 py-6 text-white flex flex-col items-center justify-center shrink-0 shadow-2xl min-w-[220px] translate-y-3 lg:translate-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl font-black text-white">{isDemoProvider ? '4.9' : '5.0'}</span>
                  <Star className="w-6 h-6 fill-[#FBBF24] text-[#FBBF24]" />
                </div>
                <span className="text-white/70 text-xs font-bold mt-1.5">
                  {isDemoProvider ? 'التصنيف الحالي' : 'حساب موثق وجديد'}
                </span>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-white/60 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-[#FB8731]" />
                  <span>جاهز للعمليات اللوجستية</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Stat Cards Row matching XD (Rectangle 37, 38, 39, 40) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 (Right): إيرادات الشهر */}
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
                {isDemoProvider ? '$487,500' : '$0'}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">إيرادات الشهر</div>
              <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                {isDemoProvider ? 'اكتوبر2026' : 'لا توجد إيرادات بعد'}
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

          {/* Card 2: عروض مقدمة */}
          <div className="bg-white rounded-[22px] p-6 shadow-xs border border-gray-100/90 flex flex-col justify-between h-[190px] relative overflow-hidden text-right">
            {/* Top Row: File Icon on Blue (on Right) */}
            <div className="flex items-center justify-end">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5FE] flex items-center justify-center text-[#0284C7]">
                <FileText className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Middle & Bottom Content */}
            <div className="relative z-10">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoProvider ? '84' : (liveRfqCount !== null ? liveRfqCount : '0')}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">عروض وطلبات متاحة</div>
              <div className="text-xs font-semibold text-[#64748B] mt-0.5">
                {isDemoProvider ? '61 مقبول' : 'جاهز لتقديم عروض الأسعار'}
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
                {isDemoProvider ? '29' : (liveShipmentsCount !== null ? liveShipmentsCount : '0')}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">شحنات نشطة</div>
              <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                {isDemoProvider ? 'منذ الثلاثاء' : 'لا توجد شحنات جارية'}
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

          {/* Card 4: معدل التحويل */}
          <div className="bg-white rounded-[22px] p-6 shadow-xs border border-gray-100/90 flex flex-col justify-between h-[190px] relative overflow-hidden text-right">
            {/* Top Row: Ribbon Icon on Purple (on Right) */}
            <div className="flex items-center justify-end">
              <div className="w-10 h-10 rounded-xl bg-[#F6EEFD] flex items-center justify-center text-[#8B5CF6]">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Middle & Bottom Content */}
            <div className="relative z-10">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoProvider ? '72.6%' : '100%'}
              </div>
              <div className="text-sm font-bold text-[#475569] mt-1">جاهزية الحساب</div>
              <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                {isDemoProvider ? 'من اجمالي العروض' : 'مؤهل للمنافسة'}
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

        {/* Bottom Section: Chart (Right) & Proposals Performance (Left) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Right Card: المبيعات الشهرية */}
          <div className="bg-white rounded-[24px] p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isDemoProvider ? 'bg-[#E8FAF0] text-[#009F65]' : 'bg-[#FFF7ED] text-[#FB8731]'}`}>
                <TrendingUp className="w-3 h-3" />
                <span>{isDemoProvider ? '18.4%+' : 'حساب جديد'}</span>
              </span>

              <div className="flex items-center gap-2">
                <h3 className="text-base lg:text-lg font-bold text-[#011222]">المبيعات الشهرية (2026)</h3>
                <div className="w-7 h-7 rounded-lg border border-[#FB8731]/40 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Recharts Area Chart or Empty state */}
            {isDemoProvider ? (
              <div className="w-full h-[240px] mt-2" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="orangeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FB8731" stopOpacity={0.35} />
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
                      domain={[0, 600]}
                      ticks={[0, 150, 300, 450, 600]}
                      tickFormatter={(v) => `$${v}K`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      formatter={(val) => [`$${val},000`, 'المبيعات']}
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
                      dataKey="sales"
                      stroke="#FB8731"
                      strokeWidth={3}
                      fill="url(#orangeAreaGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center text-center p-6 bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4EB] flex items-center justify-center text-[#FB8731] mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#011222]">لا توجد مبيعات مسجلة بعد</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">ستظهر إحصائيات المبيعات والأرباح الشهرية هنا فور اعتماد عروضك من قِبل المستوردين وبدء تنفيذ الشحنات.</p>
                <Link
                  to="/dashboard/rfq"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FB8731] text-white text-xs font-bold rounded-xl hover:bg-[#e07220] transition-colors shadow-sm"
                >
                  <span>استعراض طلبات RFQ وتقديم عرض</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Left Card: أداء العروض */}
          <div className="bg-white rounded-[24px] p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-end gap-2 mb-4">
              <h3 className="text-base lg:text-lg font-bold text-[#011222]">أداء العروض</h3>
              <div className="w-7 h-7 rounded-lg border border-[#FB8731]/40 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            {/* 3 Metric Boxes */}
            <div className="grid grid-cols-3 gap-3.5 my-2">
              <div className="bg-[#E8F4FD] rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-[#0284C7] leading-none">
                  {isDemoProvider ? '84' : '0'}
                </div>
                <div className="text-xs font-bold text-[#0284C7] mt-1.5">مقدّمة</div>
              </div>

              <div className="bg-[#E8FAF0] rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-[#009F65] leading-none">
                  {isDemoProvider ? '61' : '0'}
                </div>
                <div className="text-xs font-bold text-[#009F65] mt-1.5">مقبولة</div>
              </div>

              <div className="bg-[#FEECEC] rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-[#EF4444] leading-none">
                  {isDemoProvider ? '23' : '0'}
                </div>
                <div className="text-xs font-bold text-[#EF4444] mt-1.5">مرفوضة</div>
              </div>
            </div>

            {/* 3 Progress Bars */}
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#009F65]">{isDemoProvider ? '72.4%' : '100%'}</span>
                  <span className="text-[#64748B]">معدل الجاهزية</span>
                </div>
                <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden flex justify-end">
                  <div
                    className="h-full rounded-full bg-[#009F65] transition-all duration-500"
                    style={{ width: isDemoProvider ? '72.4%' : '100%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#0284C7]">{isDemoProvider ? '2.4 ساعه' : 'فوري'}</span>
                  <span className="text-[#64748B]">متوسط وقت الرد</span>
                </div>
                <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden flex justify-end">
                  <div
                    className="h-full rounded-full bg-[#0894ED] transition-all duration-500"
                    style={{ width: isDemoProvider ? '58%' : '100%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#8B5CF6]">{isDemoProvider ? '4.9/5' : '5.0/5'}</span>
                  <span className="text-[#64748B]">تقييم المنصة</span>
                </div>
                <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden flex justify-end">
                  <div
                    className="h-full rounded-full bg-[#8B5CF6] transition-all duration-500"
                    style={{ width: isDemoProvider ? '96%' : '100%' }}
                  ></div>
                </div>
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
