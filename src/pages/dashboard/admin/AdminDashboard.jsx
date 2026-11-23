import { useState, useRef, useEffect } from 'react'
import AdminSidebar from '../../../components/dashboard/AdminSidebar'
import AdminHeader from '../../../components/dashboard/AdminHeader'
import RealLogisticsMap from '../../../components/dashboard/RealLogisticsMap'
import {
  Bell,
  Users,
  Handshake,
  Truck,
  Ship,
  Plane,
  FileCheck,
  Clock,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  Hexagon
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Revenue Growth Data - Monthly (شهري)
const revenueDataMonthly = [
  { label: 'يناير', barVal: 390, lineVal: 450, total: '450K' },
  { label: 'فبراير', barVal: 490, lineVal: 580, total: '580K' },
  { label: 'مارس', barVal: 550, lineVal: 620, total: '620K' },
  { label: 'ابريل', barVal: 600, lineVal: 680, total: '680K' },
  { label: 'مايو', barVal: 680, lineVal: 730, total: '730K' },
  { label: 'يونيو', barVal: 845, lineVal: 920, total: '920K' },
]

// Revenue Growth Data - Weekly (أسبوعي)
const revenueDataWeekly = [
  { label: 'الأسبوع 1', barVal: 185, lineVal: 210, total: '210K' },
  { label: 'الأسبوع 2', barVal: 215, lineVal: 240, total: '240K' },
  { label: 'الأسبوع 3', barVal: 195, lineVal: 230, total: '230K' },
  { label: 'الأسبوع 4', barVal: 250, lineVal: 290, total: '290K' },
]

// Shipment Distribution by Type Data (الشحنات حسب نوع النقل)
const shipmentTypeData = [
  { name: 'بري', value: 38, count: '3,325', color: '#FB8731' },
  { name: 'بحري', value: 32, count: '2,800', color: '#011222' },
  { name: 'جوي', value: 30, count: '2,625', color: '#0284C7' },
]

// Recent Platform Activities (أحدث الأنشطة في المنصة)
const recentActivities = [
  {
    id: 1,
    title: 'طلب شحنة جديدة من العميل أحمد محمد',
    time: 'منذ 5 دقائق',
    dotColor: '#0284C7'
  },
  {
    id: 2,
    title: 'تم اعتماد شركة النقل البحري',
    time: 'منذ 15 دقيقة',
    dotColor: '#009F65'
  },
  {
    id: 3,
    title: 'تم تحديث حالة الشحنة SHN-2026-884',
    time: 'منذ 30 دقيقة',
    dotColor: '#FB8731'
  },
  {
    id: 4,
    title: 'رسالة جديدة من أحد المستخدمين',
    time: 'منذ ساعة',
    dotColor: '#011222'
  },
  {
    id: 5,
    title: 'تم إتمام عملية دفع بنجاح',
    time: 'منذ ساعتين',
    dotColor: '#009F65'
  }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('شهري')
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const timeDropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentRevenueData = timeFilter === 'أسبوعي' ? revenueDataWeekly : revenueDataMonthly
  const peakRevenueBadge = timeFilter === 'أسبوعي' ? '$250K' : '$845K'

  const filteredActivities = recentActivities.filter((act) => {
    if (!searchTerm.trim()) return true
    return act.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
  })

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] relative overflow-hidden font-almarai" dir="rtl">
      {/* Right Fixed Admin Sidebar */}
      <AdminSidebar activePath="/admin" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[280px] flex flex-col min-h-screen select-none overflow-x-hidden">
        
        {/* Top Header Bar pinned edge-to-edge matching screenshot */}
        <AdminHeader searchValue={searchTerm} onSearch={setSearchTerm} />

        {/* Inner Content Area */}
        <div className="p-6 lg:p-8 space-y-6">
          
          {/* Subheader: لوحة المؤشرات الرئيسية العامة */}
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
              لوحة المؤشرات الرئيسية العامة
            </h1>
          </div>

          {/* 1. TOP 4 METRIC CARDS ROW with Harmonious Translucent Tinted Backgrounds */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Card 1 (Far Right in RTL): عدد المستوردين ومزودي الخدمة والناقلين والشاحنات (Translucent Indigo Tint) */}
            <div className="bg-[#F5F3FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#DDD6FE]/70 hover:border-[#8B5CF6]/50 shadow-[0_2px_12px_rgba(124,58,237,0.04)] hover:shadow-md transition-all flex flex-col justify-between text-right">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-black text-[#4C1D95] leading-snug text-right">
                  عدد المستوردين المسجلين ومزودي الخدمة والناقلين المعتمدين وعدد الشاحنات المربوطة
                </span>
                
                {/* Purple Icon Box */}
                <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#DDD6FE]/80 pt-3 border-t border-[#DDD6FE]/80 text-center">
                <div className="px-1">
                  <Users className="w-4 h-4 text-[#7C3AED] mx-auto mb-1" />
                  <span className="text-sm font-black text-[#011222] block font-mono">570</span>
                  <span className="text-[10px] text-gray-500 font-bold">مستورد خدمة</span>
                </div>
                <div className="px-1">
                  <Handshake className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
                  <span className="text-sm font-black text-[#011222] block font-mono">680</span>
                  <span className="text-[10px] text-gray-500 font-bold">مزود خدمة</span>
                </div>
                <div className="px-1">
                  <Truck className="w-4 h-4 text-[#4338CA] mx-auto mb-1" />
                  <span className="text-sm font-black text-[#011222] block font-mono">320</span>
                  <span className="text-[10px] text-gray-500 font-bold">شاحنة</span>
                </div>
              </div>
            </div>

            {/* Card 2 (2nd from Right): إجمالي الشحنات النشطة والمتكاملة (Translucent Emerald Green Tint) */}
            <div className="bg-[#ECFDF5]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#A7F3D0]/70 hover:border-[#10B981]/50 shadow-[0_2px_12px_rgba(16,185,129,0.04)] hover:shadow-md transition-all flex flex-col justify-between text-right">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-black text-[#065F46] leading-snug text-right">
                  إجمالي الشحنات النشطة والمتكاملة
                </span>
                
                {/* Emerald Hexagon Box */}
                <div className="w-11 h-11 rounded-2xl bg-[#009F65] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-x-reverse divide-[#A7F3D0]/80 pt-3 border-t border-[#A7F3D0]/80 text-center">
                <div className="px-0.5">
                  <Ship className="w-3.5 h-3.5 text-[#065F46] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#011222] block font-mono">2,150</span>
                  <span className="text-[9px] text-gray-500 font-bold">بحري</span>
                </div>
                <div className="px-0.5">
                  <Truck className="w-3.5 h-3.5 text-[#065F46] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#011222] block font-mono">3,200</span>
                  <span className="text-[9px] text-gray-500 font-bold">بري</span>
                </div>
                <div className="px-0.5">
                  <Plane className="w-3.5 h-3.5 text-[#0284C7] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#011222] block font-mono">2,900</span>
                  <span className="text-[9px] text-gray-500 font-bold">جوي</span>
                </div>
                <div className="px-0.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#065F46] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#011222] block font-mono">500</span>
                  <span className="text-[9px] text-gray-500 font-bold">التخليص الجمركي</span>
                </div>
              </div>
            </div>

            {/* Card 3 (3rd from Right / 2nd from Left): صافي إيرادات وعمولات المنصة (Translucent Sky Blue Tint) */}
            <div className="bg-[#F0F9FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#BAE6FD]/70 hover:border-[#0284C7]/50 shadow-[0_2px_12px_rgba(2,132,199,0.04)] hover:shadow-md transition-all flex flex-col justify-between text-right">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-black text-[#0369A1] leading-snug text-right">
                  صافي إيرادات وعمولات المنصة
                </span>
                
                {/* 3D Blue Trending Bars */}
                <div className="w-11 h-11 rounded-2xl bg-white/90 border border-[#BAE6FD] flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-7 h-7 text-[#0284C7]" viewBox="0 0 28 28" fill="currentColor">
                    <rect x="4" y="15" width="4.5" height="10" rx="1.5" fill="#38BDF8" />
                    <rect x="11.5" y="10" width="4.5" height="15" rx="1.5" fill="#0284C7" />
                    <rect x="19" y="5" width="4.5" height="20" rx="1.5" fill="#0369A1" />
                    <path d="M5 12L13 7L21 3L25 7" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </div>

              <div className="mt-2 text-right">
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono tracking-tight">
                  $845,200
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#009F65] mt-1.5 font-mono">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>14%</span>
                </div>
              </div>
            </div>

            {/* Card 4 (Far Left in RTL): إجمالي حجم التداول والعمليات اللوجستية (Translucent Meynaa Orange Tint) */}
            <div className="bg-[#FFF7ED]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#FED7AA]/70 hover:border-[#FB8731]/50 shadow-[0_2px_12px_rgba(251,135,49,0.04)] hover:shadow-md transition-all flex flex-col justify-between text-right">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-black text-[#9A3412] leading-snug text-right">
                  إجمالي حجم التداول والعمليات اللوجستية
                </span>
                
                {/* 3D Orange Stacked Coins */}
                <div className="w-11 h-11 rounded-2xl bg-white/90 border border-[#FED7AA] flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
                    <ellipse cx="14" cy="21" rx="9.5" ry="3.8" fill="#C2410C" />
                    <ellipse cx="14" cy="19.5" rx="9.5" ry="3.8" fill="#FB8731" />
                    <ellipse cx="14" cy="15.5" rx="9.5" ry="3.8" fill="#C2410C" />
                    <ellipse cx="14" cy="14" rx="9.5" ry="3.8" fill="#FB8731" />
                    <ellipse cx="14" cy="10" rx="9.5" ry="3.8" fill="#EA580C" />
                    <ellipse cx="14" cy="8.5" rx="9.5" ry="3.8" fill="#FDBA74" />
                    <ellipse cx="14" cy="8.5" rx="7.5" ry="2.8" fill="#FB8731" />
                  </svg>
                </div>
              </div>

              <div className="mt-2 text-right">
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono tracking-tight">
                  $12,850,000
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#009F65] mt-1.5 font-mono">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>12%</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. MIDDLE ROW (3 CARDS): On-Time SLA Gauge (Right), Heatmap Map (Center), Revenue Chart (Left) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* 1. Right Card (Col 1 in RTL): نسبة الالتزام بأوقات الوصول (Circular Gauge Ring) */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between text-center">
              <div className="flex items-center justify-between text-right mb-2">
                <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                  نسبة الالتزام بأوقات الوصول
                </h3>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>

              {/* Circular Gauge Ring */}
              <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="11"
                  />
                  {/* 92% Progress Arc in Emerald Green */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#009F65"
                    strokeWidth="11"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - 0.92)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Inside Value & Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#011222] font-mono leading-none">
                    92%
                  </span>
                  <span className="text-xs font-bold text-gray-500 mt-1">
                    On Time
                  </span>
                </div>
              </div>

              {/* Bottom Comparison */}
              <div className="text-center pt-2 border-t border-gray-100">
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#009F65] font-mono">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>5%</span>
                </div>
                <span className="text-[11px] text-gray-500 font-bold block mt-0.5">
                  مقارنه بالشهر الماضي
                </span>
              </div>
            </div>

            {/* 2. Center Card (Col 2 in RTL): خريطة حرارية وتوزيع لحركة البضائع عبر الموانئ والمنافذ */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="text-right mb-3">
                <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                  خريطة حرارية وتوزيع لحركة البضائع عبر الموانئ ومنافذ المملكة والخليج
                </h3>
              </div>

              {/* Real Interactive Leaflet Heatmap Map */}
              <RealLogisticsMap />
            </div>

            {/* 3. Left Card (Col 3 in RTL): منحنى الإيرادات والنمو المالي (Bar + Line Combo Chart) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-orange-50 text-[#FB8731] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                    منحنى الإيرادات والنمو المالي والأسبوعي والشهري
                  </h3>
                </div>
                
                {/* Interactive Weekly / Monthly Filter Dropdown */}
                <div className="relative" ref={timeDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-700 flex items-center gap-1.5 hover:bg-gray-100 hover:border-[#FB8731] transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{timeFilter}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showTimeDropdown ? 'rotate-180 text-[#FB8731]' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showTimeDropdown && (
                    <div className="absolute left-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-30 animate-fade-in text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setTimeFilter('شهري')
                          setShowTimeDropdown(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          timeFilter === 'شهري'
                            ? 'bg-orange-50 text-[#FB8731]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>شهري</span>
                        {timeFilter === 'شهري' && <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTimeFilter('أسبوعي')
                          setShowTimeDropdown(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          timeFilter === 'أسبوعي'
                            ? 'bg-orange-50 text-[#FB8731]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>أسبوعي</span>
                        {timeFilter === 'أسبوعي' && <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Relative Tooltip Peak Flag matching screenshot */}
              <div className="w-full flex justify-end pl-8 mb-1">
                <span className="bg-[#011222] text-white font-mono text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm border border-white/20 transition-all">
                  {peakRevenueBadge}
                </span>
              </div>

              {/* Recharts Combo Chart dynamically reflecting Weekly / Monthly */}
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#011222', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val ? val + 'K' : 0}`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 11, textAlign: 'right', direction: 'rtl' }}
                      formatter={(val) => [`$${val},000`, 'الإيرادات']}
                    />
                    <Bar dataKey="barVal" fill="#FB8731" radius={[8, 8, 0, 0]} maxBarSize={32} />
                    <Line type="monotone" dataKey="lineVal" stroke="#011222" strokeWidth={2.8} dot={{ r: 4.5, fill: '#011222' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* 3. BOTTOM ROW (3 CARDS): Registered Stats (Right), Transport Type Donut (Center), Recent Activities (Left) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* 1. Right Card (Col 1 in RTL): إحصائيات المسجلين في المنصة */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-right mb-3">
                <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                  إحصائيات المسجلين في المنصة
                </h3>
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#0284C7] flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                {/* Panel 1: المستوردين */}
                <div className="bg-[#FFF7ED] border border-orange-200/60 rounded-2xl p-3 flex flex-col justify-between">
                  <Users className="w-5 h-5 text-[#FB8731] mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">
                    عدد المستوردين المسجلين
                  </span>
                  <span className="text-xl font-black text-[#FB8731] font-mono">
                    570
                  </span>
                </div>

                {/* Panel 2: مزودي الخدمة المعتمدين */}
                <div className="bg-[#EFF6FF] border border-blue-200/60 rounded-2xl p-3 flex flex-col justify-between">
                  <Handshake className="w-5 h-5 text-[#0284C7] mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">
                    عدد مزودي الخدمة والناقلين المعتمدين
                  </span>
                  <span className="text-xl font-black text-[#0284C7] font-mono">
                    680
                  </span>
                </div>

                {/* Panel 3: الشاحنات المسجلة */}
                <div className="bg-[#FAF5FF] border border-purple-200/60 rounded-2xl p-3 flex flex-col justify-between">
                  <Truck className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">
                    عدد مزودي الخدمة والناقلين المسجلين
                  </span>
                  <span className="text-xl font-black text-purple-600 font-mono">
                    320
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Center Card (Col 2 in RTL): الشحنات حسب نوع النقل (Donut Chart) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-right mb-3">
                <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                  الشحنات حسب نوع النقل
                </h3>
                <span className="w-7 h-7 rounded-lg bg-orange-50 text-[#FB8731] flex items-center justify-center">
                  <Hexagon className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Donut Chart with Recharts */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shipmentTypeData}
                        dataKey="value"
                        innerRadius={42}
                        outerRadius={60}
                        paddingAngle={3}
                      >
                        {shipmentTypeData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center of Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-lg font-black text-[#011222] font-mono leading-none">
                      8,750
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold mt-0.5">
                      إجمالي الشحنات
                    </span>
                  </div>
                </div>

                {/* Legend with Icons */}
                <div className="space-y-3 flex-1 text-right">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Ship className="w-4 h-4 text-[#011222]" />
                      <span className="text-[#011222]">بحري</span>
                    </div>
                    <span className="font-mono text-sm font-black text-[#011222]">32%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#FB8731]" />
                      <span className="text-[#FB8731]">بري</span>
                    </div>
                    <span className="font-mono text-sm font-black text-[#FB8731]">38%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#0284C7]" />
                      <span className="text-[#0284C7]">جوي</span>
                    </div>
                    <span className="font-mono text-sm font-black text-[#0284C7]">30%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Left Card (Col 3 in RTL): أحدث الأنشطة في المنصة */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-right mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                    أحدث الأنشطة في المنصة
                  </h3>
                  {searchTerm && (
                    <span className="text-[10px] font-bold text-[#FB8731] bg-orange-50 px-2 py-0.5 rounded-full">
                      تصفية: {searchTerm}
                    </span>
                  )}
                </div>
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#0284C7] flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="space-y-3.5 divide-y divide-gray-100 text-right">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400 font-medium">
                    لا توجد أنشطة تطابق البحث
                  </div>
                ) : (
                  filteredActivities.map((act) => (
                    <div key={act.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: act.dotColor }}
                        />
                        <span className="font-bold text-[#011222] text-[11px] sm:text-xs">
                          {act.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0 font-mono">
                        {act.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
