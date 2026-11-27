import { useState, useEffect } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import api from '../../../services/api'
import {
  Search,
  RotateCcw,
  Plus,
  Ship,
  Plane,
  Clock,
  Send,
  Check,
  Globe,
  MapPin,
  ChevronDown,
  Bell,
  ClipboardList,
  X,
} from 'lucide-react'


const initialRfqItems = [
  {
    id: 'SHN-2026-888',
    importer: 'شركة الأفق للاستيراد',
    type: 'بحري',
    origin: 'الصين (شنغهاي)',
    destination: 'ميناء جبل علي (دبي)',
    weight: '12 طن',
    date: '2026-09-05',
    budget: '$8,000-$10,000',
    status: 'جديد',
    statusBg: '#DCF0FE',
    statusColor: '#0284C7',
  },
  {
    id: 'SHN-2026-800',
    importer: 'مؤسسة البسمة للتجارة',
    type: 'جوي',
    origin: 'مطار الرياض',
    destination: 'مطار مسقط الدولي (عمان)',
    weight: '6 طن',
    date: '2026-09-08',
    budget: '$3,500-$4,500',
    status: 'قيد المراجعة',
    statusBg: '#FEDECA',
    statusColor: '#EA580C',
  },
  {
    id: 'SHN-2026-901',
    importer: 'شركة الخليج التقنية',
    type: 'بحري',
    origin: 'ميناء نينغبو (الصين)',
    destination: 'ميناء خليفة (أبو ظبي)',
    weight: '2.5 طن',
    date: '2026-09-10',
    budget: '$2,000-$3,000',
    status: 'تم تقديم عرض',
    statusBg: '#D6F5E6',
    statusColor: '#059669',
  },
  {
    id: 'SHN-2026-855',
    importer: 'مؤسسة النور التجارية',
    type: 'جوي',
    origin: 'سيدني (استراليا)',
    destination: 'مطار الملك فهد (الدمام)',
    weight: '8 طن',
    date: '2026-09-12',
    budget: '$4,000-$5,500',
    status: 'جديد',
    statusBg: '#DCF0FE',
    statusColor: '#0284C7',
  },
  {
    id: 'SHN-2026-812',
    importer: 'مجموعة المشرق التجارية',
    type: 'بحري',
    origin: 'ميناء صلالة (عمان)',
    destination: 'ميناء راشد (دبي)',
    weight: '4 طن',
    date: '2026-09-15',
    budget: '$1,500-$2,500',
    status: 'مغلق',
    statusBg: '#D5DDE4',
    statusColor: '#475569',
  },
]

export default function RFQPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoProvider = currentUser?.email === 'provider@meynaa.com'

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('الكل')
  const [typeFilter, setTypeFilter] = useState('الكل')

  const [rfqList, setRfqList] = useState(() => (isDemoProvider ? initialRfqItems : []))
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    rfqId: (isDemoProvider && initialRfqItems.length > 0) ? initialRfqItems[0].id : '',
    freightCost: '5200',
    customsCost: '650',
    truckingCost: '800',
    insuranceCost: '150',
    carrier: 'Maersk Line / الخط الملاحي ميرسك',
    transitTime: '12 - 14 يوم عمل',
    pickupDate: '2026-09-12',
    validityDays: '14 يوماً',
    notes: 'السعر شامل رسوم التفريغ والتوثيق الجمركي النهائي والتسليم لباب المستودع.'
  })

  // قراءة طلبات عروض الأسعار المفتوحة من قاعدة بيانات Supabase
  useEffect(() => {
    if (isDemoProvider) return
    api.get('/rfq/market')
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const mapped = res.data.map((r) => ({
            id: r.rfqNumber || `RFQ-${r.id.slice(0, 8)}`,
            dbId: r.id,
            importer: r.importer?.fullName || 'مستورد معتمد',
            type: r.sector || 'بحري',
            origin: r.originCity || 'ميناء المنشأ',
            destination: r.destinationCity || 'مستودع الوجهة',
            weight: '15 طن',
            date: new Date(r.createdAt || Date.now()).toLocaleDateString('ar-SA'),
            budget: r.budgetMax ? `$${r.budgetMax.toLocaleString()}` : '$5,000-$10,000',
            status: r.status === 'OPEN' ? 'جديد' : 'قيد المراجعة',
            statusBg: r.status === 'OPEN' ? '#DCF0FE' : '#FEDECA',
            statusColor: r.status === 'OPEN' ? '#0284C7' : '#EA580C',
          }))
          setRfqList(mapped)
          if (mapped.length > 0) {
            setQuoteForm((prev) => ({ ...prev, rfqId: mapped[0].id }))
          }
        } else {
          setRfqList([])
        }
      })
      .catch(() => {
        setRfqList([])
      })
  }, [isDemoProvider])

  // Stat cards dynamically calculated from active rfqList or demo counts
  const statCards = [
    {
      title: 'اجمالي الطلبات',
      count: isDemoProvider ? '41' : String(rfqList.length),
      changeText: isDemoProvider ? '9 عن الأسبوع الماضي' : 'طلبات متاحة بالسوق',
      changeColor: '#D97706',
      bg: '#FEFBF3',
      iconBg: '#FDE68A',
      iconColor: '#D97706',
      icon: Globe,
    },
    {
      title: 'عروض مقدمة',
      count: isDemoProvider ? '8' : String(rfqList.filter((r) => r.status === 'تم تقديم عرض').length),
      changeText: isDemoProvider ? '3 عن الأسبوع الماضي' : 'عروضك التنافسية',
      changeColor: '#0284C7',
      bg: '#F5FBFE',
      iconBg: '#BAE6FD',
      iconColor: '#0284C7',
      icon: Check,
    },
    {
      title: 'طلبات جديدة',
      count: isDemoProvider ? '24' : String(rfqList.filter((r) => r.status === 'جديد' || r.status === 'OPEN').length),
      changeText: isDemoProvider ? '6 عن الأسبوع الماضي' : 'متاحة للتقديم الفوري',
      changeColor: '#7C3AED',
      bg: '#FAF8FE',
      iconBg: '#DDD6FE',
      iconColor: '#7C3AED',
      icon: Send,
    },
    {
      title: 'عروض قيد المراجعة',
      count: isDemoProvider ? '12' : String(rfqList.filter((r) => r.status === 'قيد المراجعة').length),
      changeText: isDemoProvider ? '2 عن الأسبوع الماضي' : 'بانتظار قبول المستورد',
      changeColor: '#059669',
      bg: '#F4FCF9',
      iconBg: '#A7F3D0',
      iconColor: '#059669',
      icon: Clock,
    },
  ]

  // Selected RFQ object
  const currentRfq = rfqList.find((r) => r.id === quoteForm.rfqId) || rfqList[0]

  // Calculate total automatically
  const totalQuotePrice =
    (parseFloat(quoteForm.freightCost) || 0) +
    (parseFloat(quoteForm.customsCost) || 0) +
    (parseFloat(quoteForm.truckingCost) || 0) +
    (parseFloat(quoteForm.insuranceCost) || 0)

  const handleOpenQuoteModal = (targetRfqId = null) => {
    if (targetRfqId) {
      setQuoteForm((prev) => ({ ...prev, rfqId: targetRfqId }))
    }
    setShowQuoteModal(true)
  }

  const handleFormChange = (e) => {
    setQuoteForm({ ...quoteForm, [e.target.name]: e.target.value })
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()

    const targetDbId = currentRfq?.dbId || currentRfq?.id
    if (targetDbId && !isDemoProvider) {
      try {
        await api.post('/rfq/quote', {
          rfqId: targetDbId,
          price: totalQuotePrice,
          transitDays: parseInt(quoteForm.transitTime, 10) || 14,
          notes: quoteForm.notes
        })
      } catch (err) {
        console.warn('API post quote notice:', err.message)
      }
    }

    // Mark RFQ as quoted
    setRfqList(
      rfqList.map((item) =>
        item.id === quoteForm.rfqId
          ? {
              ...item,
              status: 'تم تقديم عرض',
              statusBg: '#D6F5E6',
              statusColor: '#059669'
            }
          : item
      )
    )

    setShowQuoteModal(false)
    setToastMessage(
      `تم إرسال عرض السعر بنجاح بقيمة $${totalQuotePrice.toLocaleString()} للطلب ${quoteForm.rfqId} (${currentRfq.importer})!`
    )
    setTimeout(() => setToastMessage(null), 4500)
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('الكل')
    setTypeFilter('الكل')
  }

  const filtered = rfqList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.importer.includes(searchTerm)
    const matchesStatus = statusFilter === 'الكل' || item.status === statusFilter
    const matchesType = typeFilter === 'الكل' || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
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
      <Sidebar activePath="/dashboard/rfq" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top White Header Bar - Rectangle 175 in XD */}
        <header className="bg-white rounded-2xl px-8 py-5 shadow-xs border border-gray-100 flex items-center justify-between">
          {/* Right: Title & Subtitle + Orange Clipboard Icon */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#011222] tracking-tight">طلبات عروض الأسعار</h1>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">ادارة و متابعة طلبات عروض الاسعار</p>
            </div>
          </div>

          {/* Left: Search input + Notification bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="....ابحث"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Success Toast Notification */}
        {toastMessage && (
          <div className="bg-[#011222] text-white px-6 py-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xl border border-white/10 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#009F65] shrink-0 animate-ping"></span>
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white mr-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4 Stat Cards Row - matching XD Rectangle 188, 191, 192, 193 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={i}
                style={{ backgroundColor: card.bg }}
                className="rounded-2xl p-5 shadow-xs border border-gray-100/80 flex items-center justify-between h-[120px] text-right"
              >
                {/* Left: Rounded square icon container */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>

                {/* Right: Numbers and texts */}
                <div>
                  <div className="text-3xl font-black text-[#011222] tracking-tight">
                    {card.count}
                  </div>
                  <div className="text-xs font-bold text-[#011222] mt-0.5">
                    {card.title}
                  </div>
                  <div
                    className="text-[11px] font-bold mt-0.5"
                    style={{ color: card.changeColor }}
                  >
                    <span>{card.changeText}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Filter Controls Row matching XD */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-right">
            {/* حالة الطلب Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#64748B]">حالة الطلب</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#CBD5E1] rounded-xl px-4 py-2 pr-4 pl-9 text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] cursor-pointer"
                >
                  <option value="الكل">الكل</option>
                  <option value="جديد">جديد</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="تم تقديم عرض">تم تقديم عرض</option>
                  <option value="مغلق">مغلق</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* نوع الشحنة Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#64748B]">نوع الشحنة</label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#CBD5E1] rounded-xl px-4 py-2 pr-4 pl-9 text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] cursor-pointer"
                >
                  <option value="الكل">الكل</option>
                  <option value="بحري">بحري</option>
                  <option value="جوي">جوي</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* إعادة تعيين Button */}
            <div className="pt-4 sm:pt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:text-[#011222] hover:bg-gray-50 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة تعيين</span>
              </button>
            </div>
          </div>

          {/* Left side Action Button: تقديم عرض سعر (مطابق للصورة) */}
          <button
            onClick={() => handleOpenQuoteModal()}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#FB8731] hover:bg-[#E06F1B] text-white text-xs font-black shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>تقديم عرض سعر</span>
          </button>
        </section>

        {/* Table Container - matching XD Rectangle 190 & 200 */}
        <section className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          {/* Table Card Title */}
          <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between text-right">
            <span className="text-xs font-bold text-[#64748B] bg-gray-100 px-3 py-1 rounded-lg">
              {filtered.length} طلبات متاحة
            </span>
            <h3 className="text-base font-black text-[#011222]">طلبات عروض الأسعار</h3>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-14 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl m-6 border border-dashed border-gray-200">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] text-[#FB8731] flex items-center justify-center mb-3 shadow-xs">
                <ClipboardList className="w-7 h-7" />
              </div>
              <p className="text-sm font-black text-[#011222]">لا توجد طلبات عروض أسعار متاحة حالياً</p>
              <p className="text-xs text-gray-500 mt-1.5 max-w-md leading-relaxed px-4">
                حسابك مفعل وجاهز. ستظهر هنا كافة طلبات عروض الأسعار (RFQ) فور نشرها من قبل المستوردين في السوق اللوجستي لتتمكن من تقديم عروضك مباشرة.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#F0F3F8] border-b border-[#E2E8F0] text-[#011222] font-black text-xs">
                    <th className="py-4 px-6 text-right">رقم الطلب</th>
                    <th className="py-4 px-6 text-right">اسم المستورد</th>
                    <th className="py-4 px-6 text-right">نوع الشحنة</th>
                    <th className="py-4 px-6 text-right">المنشأ</th>
                    <th className="py-4 px-6 text-right">الوجهة</th>
                    <th className="py-4 px-6 text-right">الوزن</th>
                    <th className="py-4 px-6 text-right">تاريخ الطلب</th>
                    <th className="py-4 px-6 text-right">الميزانية التقديرية</th>
                    <th className="py-4 px-6 text-right">حالة الطلب</th>
                    <th className="py-4 px-6 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* رقم الطلب */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#0284C7] bg-[#DCF0FE] px-3.5 py-1.5 rounded-lg font-mono inline-block">
                          {item.id}
                        </span>
                      </td>

                      {/* اسم المستورد */}
                      <td className="py-4 px-6 font-bold text-[#011222]">
                        {item.importer}
                      </td>

                      {/* نوع الشحنة */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-[#011222]">
                          {item.type === 'بحري' ? (
                            <Ship className="w-3.5 h-3.5 text-[#0284C7]" />
                          ) : (
                            <Plane className="w-3.5 h-3.5 text-[#FB8731]" />
                          )}
                          <span className="font-bold">{item.type}</span>
                        </div>
                      </td>

                      {/* المنشأ */}
                      <td className="py-4 px-6 text-[#64748B]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>{item.origin}</span>
                        </div>
                      </td>

                      {/* الوجهة */}
                      <td className="py-4 px-6 text-[#64748B]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FB8731]" />
                          <span>{item.destination}</span>
                        </div>
                      </td>

                      {/* الوزن */}
                      <td className="py-4 px-6 font-bold text-[#011222]">
                        {item.weight}
                      </td>

                      {/* تاريخ الطلب */}
                      <td className="py-4 px-6 font-mono text-[#64748B]">
                        {item.date}
                      </td>

                      {/* الميزانية التقديرية */}
                      <td className="py-4 px-6 font-black text-[#011222]">
                        {item.budget}
                      </td>

                      {/* حالة الطلب */}
                      <td className="py-4 px-6">
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

                      {/* الإجراء: زر تقديم عرض السعر */}
                      <td className="py-4 px-6 text-center">
                        {item.status === 'تم تقديم عرض' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#009F65] bg-[#E6F9F0] px-3 py-1 rounded-lg">
                            <Check className="w-3.5 h-3.5" />
                            <span>تم إرسال العرض</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenQuoteModal(item.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#FFF3EA] hover:bg-[#FB8731] text-[#FB8731] hover:text-white border border-[#FB8731]/30 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            تقديم عرض
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* ========================================================= */}
      {/* نافذة مودال: تقديم عرض سعر متكامل (Submit Quotation Modal)    */}
      {/* ========================================================= */}
      {showQuoteModal && (
        <div
          className="fixed inset-0 z-50 bg-[#011222]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-almarai"
          dir="rtl"
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            className="bg-white rounded-[26px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-scale-in text-right relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-black text-[#011222]">تقديم عرض سعر للشحنة</h3>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    تعبئة تفاصيل التكاليف والجدول الزمني والخدمات اللوجستية
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20">
                  <Send className="w-5 h-5" />
                </div>
              </div>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-6">
              {/* 1. اختيار المناقصة / الطلب المستهدف */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#011222]">
                  طلب الشحن المستهدف (RFQ)
                </label>
                <select
                  name="rfqId"
                  value={quoteForm.rfqId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right cursor-pointer"
                >
                  {rfqList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} - {r.importer} ({r.type} • {r.origin} إلى {r.destination} • {r.weight})
                    </option>
                  ))}
                </select>

                {/* بطاقة ملخص الطلب المختار */}
                {currentRfq && (
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 flex items-center justify-between text-xs mt-2">
                    <div className="text-left">
                      <span className="text-[10px] text-gray-400 block font-bold">ميزانية العميل المتوقعة</span>
                      <span className="text-sm font-black text-[#FB8731]">{currentRfq.budget}</span>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-bold text-[#011222] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>من: {currentRfq.origin} ⟵ إلى: {currentRfq.destination}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-3">
                        <span>الوزن: <strong>{currentRfq.weight}</strong></span>
                        <span>نوع الشحن: <strong>{currentRfq.type}</strong></span>
                        <span>تاريخ الطلب: <strong>{currentRfq.date}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. تفاصيل التسعير والتكاليف المالية (Pricing Breakdown) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#011222] border-r-3 border-[#FB8731] pr-2.5">
                  بيانات التسعير المالي وتفصيل البنود ($ USD)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* نولون الشحن الأساسي */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      سعر الشحن الأساسي (Freight Charge) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        name="freightCost"
                        value={quoteForm.freightCost}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-left pl-8 focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                    </div>
                  </div>

                  {/* رسوم التخليص الجمركي */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      رسوم التخليص الجمركي والمعاينة *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        name="customsCost"
                        value={quoteForm.customsCost}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-left pl-8 focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                    </div>
                  </div>

                  {/* رسوم النقل البري الداخلي */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      رسوم النقل والتوصيل الداخلي (Trucking)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="truckingCost"
                        value={quoteForm.truckingCost}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-left pl-8 focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                    </div>
                  </div>

                  {/* التأمين على البضائع */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      التأمين الشامل على البضائع (اختياري)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="insuranceCost"
                        value={quoteForm.insuranceCost}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-left pl-8 focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                    </div>
                  </div>
                </div>

                {/* بطاقة الإجمالي التلقائي */}
                <div className="p-4 rounded-2xl bg-[#011222] text-white flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-[#FB8731] font-mono">
                      ${totalQuotePrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/70">USD</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">إجمالي عرض السعر النهائي</span>
                    <span className="text-[10px] text-white/60">يشمل كافة الرسوم التشغيلية والخدمات المحددة أعلاه</span>
                  </div>
                </div>
              </div>

              {/* 3. الجدول الزمني والخدمات اللوجستية */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#011222] border-r-3 border-[#0284C7] pr-2.5">
                  الجدول الزمني والناقل المقترح
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* الناقل المقترح */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      الخط الملاحي / شركة النقل المقترحة
                    </label>
                    <input
                      type="text"
                      name="carrier"
                      value={quoteForm.carrier}
                      onChange={handleFormChange}
                      placeholder="مثال: Maersk Line أو أسطول الأفق"
                      className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                    />
                  </div>

                  {/* مدة الشحن والتسليم */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      مدة الشحن المتوقعة (Transit Time) *
                    </label>
                    <input
                      type="text"
                      required
                      name="transitTime"
                      value={quoteForm.transitTime}
                      onChange={handleFormChange}
                      placeholder="مثال: 12 - 14 يوم عمل"
                      className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                    />
                  </div>

                  {/* تاريخ الاستلام المقترح */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      تاريخ استلام الشحنة من المورد
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={quoteForm.pickupDate}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                    />
                  </div>

                  {/* مدة صلاحية العرض */}
                  <div className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      صلاحية العرض المقدم
                    </label>
                    <select
                      name="validityDays"
                      value={quoteForm.validityDays}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                    >
                      <option value="7 أيام">صالح لمدة 7 أيام</option>
                      <option value="14 يوماً">صالح لمدة 14 يوماً</option>
                      <option value="30 يوماً">صالح لمدة 30 يوماً</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. شروط وملاحظات العرض */}
              <div className="space-y-1 text-right pt-2">
                <label className="block text-[11px] font-bold text-[#475569]">
                  شروط وملاحظات إضافية للمستورد
                </label>
                <textarea
                  rows="3"
                  name="notes"
                  value={quoteForm.notes}
                  onChange={handleFormChange}
                  placeholder="أدخل أي شروط تفريغ أو استثناءات أو متطلبات مستندية خاصة..."
                  className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-medium text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                ></textarea>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex-2 py-3 rounded-xl bg-[#FB8731] hover:bg-[#E06F1B] text-white text-xs font-black shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال عرض السعر الآن (${totalQuotePrice.toLocaleString()})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
