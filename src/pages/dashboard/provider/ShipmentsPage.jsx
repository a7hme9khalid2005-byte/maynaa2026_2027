import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../../components/dashboard/Sidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import TruckTrackingMap from '../../../components/dashboard/TruckTrackingMap'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import {
  Ship,
  Search,
  Bell,
  MapPin,
  Truck,
  LayoutGrid,
  ArrowRight
} from 'lucide-react'

const initialShipments = [
  {
    id: 'SHN-2026-884',
    client: 'مجموعة الريادة للمقاولات',
    route: 'هامبورج _ جبل علي',
    value: '$87,500',
    progress: 65,
    progressColor: '#FD8713',
    status: 'قيد الشحن',
    statusBg: '#FEEBDF',
    statusColor: '#EA580C',
    eta: '2026-09-3',
  },
  {
    id: 'SHN-2026-756',
    client: 'شركة النخبة للاغذية',
    route: 'اوكلاند _ جدة',
    value: '$51,200',
    progress: 38,
    progressColor: '#FD8713',
    status: 'قيد الشحن',
    statusBg: '#DDF1FE',
    statusColor: '#0284C7',
    eta: '2026-09-12',
  },
  {
    id: 'SHN-2026-901',
    client: 'الخليج للتنقية',
    route: 'شنغهاي _ ابوظبي',
    value: '$22,400',
    progress: 88,
    progressColor: '#FD8713',
    status: 'في الجمارك',
    statusBg: '#FEEBDF',
    statusColor: '#EA580C',
    eta: '2026-08-31',
  },
  {
    id: 'SHN-2026-867',
    client: 'دار الأثاث الحديث',
    route: 'ميلانو _ الدمام',
    value: '$38,000',
    progress: 100,
    progressColor: '#009F65',
    status: 'مُسلمة',
    statusBg: '#D3F2E6',
    statusColor: '#009F65',
    eta: '2026-08-25',
  },
  {
    id: 'SHN-2026-812',
    client: 'مجموعة المشرق التجارية',
    route: 'عمان _ دبي',
    value: '$27,500',
    progress: 22,
    progressColor: '#0894ED',
    status: 'قيد الشحن',
    statusBg: '#E2F3FD',
    statusColor: '#0284C7',
    eta: '2026-09-18',
  },
]

export default function ShipmentsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoProvider = !currentUser || currentUser.email === 'provider@meynaa.com'

  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'map'
  const [selectedShipmentTruck, setSelectedShipmentTruck] = useState('TRK-104')

  const activeShipments = isDemoProvider ? initialShipments : []

  const filtered = activeShipments.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client.includes(searchTerm) ||
    item.route.includes(searchTerm)
  )

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner (Rectangle 70 in XD) */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-10"
        aria-hidden="true"
      ></div>

      {/* Decorative Orange Blob at Bottom-Right Corner (Rectangle 69 in XD) */}
      <div
        className="absolute -bottom-16 right-72 w-56 h-56 rounded-full bg-[#FB8731]/80 pointer-events-none z-0 hidden lg:block"
        aria-hidden="true"
      ></div>

      {/* Sidebar matching XD */}
      <Sidebar activePath="/dashboard/shipments" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top White Header Bar - Rectangle 174 in XD */}
        <header className="bg-white rounded-2xl px-8 py-5 shadow-xs border border-gray-100 flex items-center justify-between">
          {/* Right: Title & Subtitle + Orange Ship Icon */}
          <div className="flex items-center gap-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#FB8731]/15 border border-[#FB8731]/30 flex items-center justify-center text-[#FB8731] shrink-0">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#011222] tracking-tight">شحناتي</h1>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">تتبع وإدارة جميع الشحنات الحالية</p>
            </div>
          </div>

          {/* Left: Search input + Notification bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="....ابحث"
                className="w-52 pl-4 pr-9 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={openNotifications}
              title="الإشعارات"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#64748B] hover:text-[#011222] hover:bg-gray-50 transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FB8731] absolute top-2 right-2 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Big White Container - Rectangle 72 in XD */}
        <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-6">
          {/* Subheader: شحناتي النشطة + View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-[#FB8731]/15 border border-[#FB8731]/30 flex items-center justify-center text-[#FB8731] shrink-0">
                {viewMode === 'map' ? <Truck className="w-5 h-5" /> : <Ship className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#011222]">
                  {viewMode === 'map' ? 'خريطة التتبع الميداني لأسطول الشاحنات (GPS)' : 'شحناتي النشطة'}
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-0.5">
                  {viewMode === 'map'
                    ? 'مراقبة حركة الشاحنات، السرعة، حرارة المقطورات وخطوط السير مباشرة'
                    : '5 شحنات - 3 قيد التنفيذ'}
                </p>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="bg-[#F0F3F8] p-1.5 rounded-2xl flex items-center gap-1.5 self-start sm:self-auto border border-gray-200/60 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#011222] shadow-xs'
                    : 'text-[#64748B] hover:text-[#011222]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>عرض الجدول</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#FB8731] text-white shadow-md'
                    : 'text-[#64748B] hover:text-[#011222]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>خريطة تتبع الشاحنات</span>
                <span className="w-2 h-2 rounded-full bg-[#00E591] animate-pulse" />
              </button>
            </div>
          </div>

          {/* Conditional View: Empty state when no shipments, or Map / Table */}
          {activeShipments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center justify-center my-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF4EB] flex items-center justify-center text-[#FB8731] mb-4 shadow-sm">
                <Ship className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-[#011222]">لا توجد شحنات مسندة حتى الآن</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md leading-relaxed">
                ابدأ باستعراض طلبات عروض الأسعار (RFQ) المتاحة من المستوردين، وقدم عروضك التنافسية لتبدأ بتنفيذ شحنات جديدة.
              </p>
              <Link
                to="/dashboard/rfq"
                className="mt-5 inline-flex items-center gap-2 bg-[#FB8731] hover:bg-[#e07220] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <span>استعراض طلبات الأسعار (RFQ) المتاحة</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : viewMode === 'map' ? (
            <div className="pt-2">
              <TruckTrackingMap initialSelectedId={selectedShipmentTruck} />
            </div>
          ) : (
            /* Table Container - Rectangle 76 in XD */
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-[#F0F3F8] text-[#011222] font-black text-xs">
                      <th className="py-4 px-6 text-right">رقم الشحنة</th>
                      <th className="py-4 px-6 text-right">المصدر (المستورد)</th>
                      <th className="py-4 px-6 text-right">المسار</th>
                      <th className="py-4 px-6 text-right">القيمة</th>
                      <th className="py-4 px-6 text-right">التقدم</th>
                      <th className="py-4 px-6 text-right">الحالة</th>
                      <th className="py-4 px-6 text-right">ETA</th>
                      <th className="py-4 px-6 text-center">التتبع الميداني</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* رقم الشحنة */}
                        <td className="py-5 px-6">
                          <span className="font-bold text-[#0284C7] bg-[#E2F3FD] px-3.5 py-1.5 rounded-lg font-mono inline-block">
                            {item.id}
                          </span>
                        </td>

                        {/* المصدر (المستورد) */}
                        <td className="py-5 px-6 font-bold text-[#011222]">
                          {item.client}
                        </td>

                        {/* المسار */}
                        <td className="py-5 px-6 text-[#64748B]">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>{item.route}</span>
                          </div>
                        </td>

                        {/* القيمة (Green) */}
                        <td className="py-5 px-6 font-black text-[#009F65] text-sm font-mono">
                          {item.value}
                        </td>

                        {/* التقدم (Bar with percentage) */}
                        <td className="py-5 px-6 min-w-[140px]">
                          <div className="space-y-1.5">
                            <div className="w-28 h-2 bg-[#DFE8F3] rounded-full overflow-hidden flex justify-start">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${item.progress}%`,
                                  backgroundColor: item.progressColor,
                                }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-bold text-[#64748B] block font-mono">
                              {item.progress}%
                            </span>
                          </div>
                        </td>

                        {/* الحالة */}
                        <td className="py-5 px-6">
                          <span
                            className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold"
                            style={{
                              backgroundColor: item.statusBg,
                              color: item.statusColor,
                            }}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* ETA */}
                        <td className="py-5 px-6 font-mono text-[#64748B]">
                          {item.eta}
                        </td>

                        {/* Action: Direct GPS Truck Tracking */}
                        <td className="py-5 px-6 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedShipmentTruck(item.id)
                              setViewMode('map')
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF7ED] hover:bg-[#FB8731] text-[#FB8731] hover:text-white border border-[#FB8731]/30 font-bold text-xs transition-all cursor-pointer shadow-2xs hover:shadow-sm active:scale-95"
                            title="عرض تتبع شاحنة هذه الشحنة على خريطة الـ GPS المباشرة"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>تتبع الشاحنة</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Floating Moving Footer Bar */}
        <DashboardFooterBar />

        {/* Bottom 4 Orange Dots on Left */}
        <div className="w-full pt-3 clearfix" style={{ direction: 'ltr', textAlign: 'left' }} aria-hidden="true">
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
