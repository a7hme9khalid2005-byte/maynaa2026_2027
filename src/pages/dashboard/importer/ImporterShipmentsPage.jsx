import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImporterSidebar from '../../../components/dashboard/ImporterSidebar'
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
  ChevronDown,
  Truck,
  LayoutGrid,
  Plus
} from 'lucide-react'

const allShipments = [
  {
    id: 'SHN-2026-884',
    provider: 'شركة الأفق للشحن الدولي',
    route: 'هامبورج _ جبل علي',
    value: '$87,500',
    progress: 65,
    progressColor: '#FB8731',
    status: 'قيد الشحن',
    statusBg: '#FFF3EA',
    statusColor: '#EA580C',
    eta: '2026-09-3',
  },
  {
    id: 'SHN-2026-756',
    provider: 'التحالف اللوجستي السريع',
    route: 'مومباي _ الدمام',
    value: '$8,200',
    progress: 100,
    progressColor: '#009F65',
    status: 'مُسلمة',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    eta: '2026-09-12',
  },
  {
    id: 'SHN-2026-901',
    provider: 'مؤسسة اليمامة للتخليص',
    route: 'شنغهاي _ أبوظبي',
    value: '$12,400',
    progress: 88,
    progressColor: '#FB8731',
    status: 'في الجمارك',
    statusBg: '#FFF3EA',
    statusColor: '#FB8731',
    eta: '2026-08-31',
  },
  {
    id: 'SHN-2026-867',
    provider: 'خليج الشرق للاستيراد',
    route: 'إسطنبول _ الشارقة',
    value: '$19,000',
    progress: 38,
    progressColor: '#0284C7',
    status: 'قيد الشحن',
    statusBg: '#EBF5FE',
    statusColor: '#0284C7',
    eta: '2026-08-25',
  },
  {
    id: 'SHN-2026-923',
    provider: 'شركة النور للتخليص',
    route: 'عمان _ دبي',
    value: '$67,500',
    progress: 45,
    progressColor: '#EF4444',
    status: 'مؤجلة',
    statusBg: '#FEECEC',
    statusColor: '#EF4444',
    eta: '2026-09-18',
  },
]

export default function ImporterShipmentsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoSarah = !currentUser || currentUser.email === 'importer@meynaa.com'

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('جميع الحالات')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'map'
  const [selectedTruckShipment, setSelectedTruckShipment] = useState('SHN-2026-884')

  const filterOptions = ['جميع الحالات', 'قيد الشحن', 'في الجمارك', 'مُسلمة', 'مؤجلة']

  const activeShipmentsList = isDemoSarah ? allShipments : []

  const filtered = activeShipmentsList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.includes(searchTerm) ||
      item.route.includes(searchTerm)

    if (!matchesSearch) return false

    if (statusFilter === 'جميع الحالات') return true
    return item.status === statusFilter
  })

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner (Rectangle 23 in XD) */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-20"
        aria-hidden="true"
      ></div>

      {/* Decorative Warm Orange Shape at Bottom-Right Corner matching XD */}
      <div
        className="absolute -bottom-16 right-[300px] w-72 h-44 bg-[#FB8731]/80 rounded-[40px] rotate-12 pointer-events-none z-0 blur-xs"
        aria-hidden="true"
      ></div>

      {/* Importer Sidebar matching XD */}
      <ImporterSidebar activePath="/importer/shipments" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top Header Bar: Title on Right, Search & Bell on Left */}
        <header className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-xs flex items-center justify-between">
          {/* Right Side: Title & Subtitle + Orange Ship Icon */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl border border-[#FB8731]/30 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
              <Ship className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#011222]">شحناتي</h1>
              <p className="text-[11px] text-gray-400 font-medium">تتبع وإدارة جميع الشحنات الحالية</p>
            </div>
          </div>

          {/* Left Side: Search input & Notifications bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="...ابحث"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-right pr-9 focus:outline-none focus:border-[#FB8731]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>

            <button
              onClick={openNotifications}
              title="الإشعارات"
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-500 relative transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FB8731] absolute top-2.5 right-2.5 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Section Header: Title & Total Count + Big Search & Filter Row */}
        <section className="space-y-4">
          {/* Title on Right with Ship Icon + View Mode Switcher on Left */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-right">
              <div className="w-9 h-9 rounded-xl border border-[#FB8731]/40 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731] shrink-0">
                {viewMode === 'map' ? <Truck className="w-5 h-5 stroke-[2]" /> : <Ship className="w-5 h-5 stroke-[2]" />}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#011222]">
                  {viewMode === 'map' ? 'خريطة تتبع الشاحنات اللحظي (GPS)' : 'شحناتي'}
                </h2>
                <span className="text-xs text-gray-400 font-bold block mt-0.5">
                  {viewMode === 'map'
                    ? 'تتبع حي للمركبات والشاحنات الناقلة لبضائعك عبر الأقمار الصناعية'
                    : `إجمالي ${activeShipmentsList.length} شحنات`}
                </span>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="bg-white p-1 rounded-2xl flex items-center gap-1 self-start sm:self-auto border border-gray-200/80 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#011222] text-white shadow-xs'
                    : 'text-gray-500 hover:text-[#011222]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>عرض الجدول</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#FB8731] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#011222]'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>خريطة التتبع المباشر</span>
                <span className="w-2 h-2 rounded-full bg-[#00E591] animate-ping" />
              </button>
            </div>
          </div>

          {/* Search bar & Filter Row matching screenshot (Only in table view) */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl p-2.5 border border-gray-100 shadow-xs flex items-center justify-between gap-3">
              {/* Left: Dropdown select "جميع الحالات" */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 flex items-center gap-2 min-w-[130px] justify-between transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  <span>{statusFilter}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-30 py-1.5 text-right text-xs font-bold animate-fade-in">
                    {filterOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setStatusFilter(opt)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-right hover:bg-[#FFF7ED] hover:text-[#FB8731] transition-colors ${
                          statusFilter === opt ? 'text-[#FB8731] bg-[#FFF7ED]/50' : 'text-gray-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Big Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="بحث برقم الشحنة أو مزود الخدمة"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-right pl-10 focus:outline-none focus:border-[#FB8731]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}
        </section>

        {/* Content: Empty State when no shipments exist, or Table / Map view */}
        {activeShipmentsList.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center justify-center my-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF4EB] flex items-center justify-center text-[#FB8731] mb-4 shadow-sm">
              <Ship className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#011222]">لا توجد شحنات نشطة حتى الآن</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md leading-relaxed">
              عند قبولك لعرض سعر من أحد مزودي الخدمة وتأكيد الشحن، ستظهر شحنتك هنا فوراً مع تتبع حي ومباشر بالـ GPS لمسار الشاحنة والسفينة.
            </p>
            <Link
              to="/importer/rfq"
              className="mt-5 inline-flex items-center gap-2 bg-[#FB8731] hover:bg-[#e07220] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إنشاء أو متابعة طلبات عروض الأسعار</span>
            </Link>
          </div>
        ) : viewMode === 'map' ? (
          <div className="pt-1">
            <TruckTrackingMap initialSelectedId={selectedTruckShipment} />
          </div>
        ) : (
          /* Main Shipments Table Card matching screenshot */
          <section className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold">
                    <th className="pb-4 pr-3 text-right">رقم الشحنة</th>
                    <th className="pb-4 text-right">مزود الخدمة</th>
                    <th className="pb-4 text-right">المسار</th>
                    <th className="pb-4 text-right">القيمة</th>
                    <th className="pb-4 text-right">التقدم</th>
                    <th className="pb-4 text-center">الحالة</th>
                    <th className="pb-4 text-left pl-3 font-sans">ETA</th>
                    <th className="pb-4 text-center">التتبع المباشر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/80 font-medium">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* رقم الشحنة: Blue Pill */}
                      <td className="py-4 pr-3">
                        <span className="inline-block bg-[#EBF5FE] text-[#0284C7] font-bold font-sans text-xs px-3.5 py-1.5 rounded-xl">
                          {item.id}
                        </span>
                      </td>

                      {/* مزود الخدمة */}
                      <td className="py-4 text-[#011222] font-black text-xs">
                        {item.provider}
                      </td>

                      {/* المسار مع أيقونة اللوكيشن */}
                      <td className="py-4 text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.route}</span>
                        </div>
                      </td>

                      {/* القيمة باللون الأخضر */}
                      <td className="py-4 font-black text-[#009F65] text-sm font-sans">
                        {item.value}
                      </td>

                      {/* التقدم مع شريط ونسبة */}
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-500 font-sans font-bold w-7">
                            {item.progress}%
                          </span>
                          <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${item.progress}%`,
                                backgroundColor: item.progressColor
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* الحالة */}
                      <td className="py-4 text-center">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold inline-block min-w-[80px]"
                          style={{ backgroundColor: item.statusBg, color: item.statusColor }}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ETA */}
                      <td className="py-4 text-left pl-3 font-sans text-gray-500 font-medium">
                        {item.eta}
                      </td>

                      {/* زر تتبع الشاحنة */}
                      <td className="py-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTruckShipment(item.id)
                            setViewMode('map')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF7ED] hover:bg-[#FB8731] text-[#FB8731] hover:text-white border border-[#FB8731]/30 font-bold text-xs transition-all cursor-pointer shadow-2xs hover:shadow-sm active:scale-95"
                          title="تتبع مسار شاحنة هذه الشحنة بالـ GPS"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>تتبع الشاحنة</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-xs font-bold">
                  لا توجد شحنات تطابق بحثك حالياً.
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer Bar inside Main Area matching screenshot */}
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
