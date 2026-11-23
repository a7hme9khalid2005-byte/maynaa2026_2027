import { useState } from 'react'
import ImporterSidebar from '../../../components/dashboard/ImporterSidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import {
  FileText,
  Search,
  Bell,
  Star,
  Clock,
  Plus,
  Check,
  X
} from 'lucide-react'

const allRfqs = [
  {
    id: 'RFQ-2026-441',
    title: 'شحن معدات بناء ثقيلة',
    type: 'بحري FCL',
    bidsCount: '5 عروض',
    route: 'هامبورغ   ميناء جبل علي',
    origin: 'هامبورغ - ألمانيا',
    destination: 'ميناء جبل علي - دبي',
    weight: '45,000 كغ',
    budget: '$80,000-$100,000',
    deadline: '2026-9-15',
    date: '2026-08-24',
    status: 'قيد المراجعة',
    statusType: 'review',
    statusBg: '#F3ECFD',
    statusColor: '#8B5CF6',
    bids: [
      {
        provider: 'شركة الأفق للشحن الدولي',
        providerInitials: 'ش',
        price: '$87,500',
        status: 'قيد الانتظار',
        rating: '4.9',
        stars: 5,
        days: '18 يوم',
        note: 'نمتلك خط مباشر من هامبورغ -جبل علي أسبوعياً'
      }
    ]
  },
  {
    id: 'RFQ-2026-445',
    title: 'شحن جوي عاجل - قطع غيار آليات',
    type: 'جوي',
    bidsCount: '3 عروض',
    route: 'فرانكفورت   مطار الملك خالد',
    origin: 'فرانكفورت - ألمانيا',
    destination: 'مطار الملك خالد - الرياض',
    weight: '1,200 كغ',
    budget: '$12,000-$16,000',
    deadline: '2026-8-20',
    date: '2026-08-15',
    status: 'مكتمل',
    statusType: 'completed',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    bids: [
      {
        provider: 'النسر الذهبي للشحن السريع',
        providerInitials: 'ن',
        price: '$14,200',
        status: 'مقبول',
        rating: '4.8',
        stars: 5,
        days: '3 أيام',
        note: 'رحلة شحن مباشرة مع أولوية تفريغ وتخليص فوري'
      }
    ]
  },
  {
    id: 'RFQ-2026-425',
    title: 'مواد تشطيب - رخام إيطالي',
    type: 'بحري FCL',
    bidsCount: '5 عروض',
    route: 'كاريرا   ميناء جبل علي',
    origin: 'كاريرا - إيطاليا',
    destination: 'ميناء جبل علي - دبي',
    weight: '28,000 كغ',
    budget: '$30,000-$38,000',
    deadline: '2026-9-05',
    date: '2026-08-28',
    status: 'مفتوح',
    statusType: 'open',
    statusBg: '#EBF5FE',
    statusColor: '#0284C7',
    bids: [
      {
        provider: 'سند للخدمات اللوجستية',
        providerInitials: 'س',
        price: '$33,800',
        status: 'قيد الانتظار',
        rating: '4.7',
        stars: 5,
        days: '14 يوم',
        note: 'تأمين كامل ضد الكسر مع حاويات مبطنة مخصصة'
      }
    ]
  }
]

export default function ImporterRFQPage() {
  const { openNotifications } = useNotifications()
  const [activeTab, setActiveTab] = useState('الكل')
  const [selectedRfqId, setSelectedRfqId] = useState('RFQ-2026-441')
  const [rfqList, setRfqList] = useState(allRfqs)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionNotice, setActionNotice] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newOrigin, setNewOrigin] = useState('')
  const [newDest, setNewDest] = useState('')

  // Filter list
  const filteredRfqs = rfqList.filter((item) => {
    const matchesSearch =
      item.title.includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.route.includes(searchTerm)

    if (!matchesSearch) return false

    if (activeTab === 'الكل') return true
    if (activeTab === 'مفتوح') return item.status === 'مفتوح'
    if (activeTab === 'قيد المراجعة') return item.status === 'قيد المراجعة'
    if (activeTab === 'مكتمل') return item.status === 'مكتمل'
    return true
  })

  const selectedRfq = rfqList.find((r) => r.id === selectedRfqId) || rfqList[0]

  const handleAcceptBid = (bid) => {
    // 1. Update the bid status in rfqList
    setRfqList((prevRfqs) =>
      prevRfqs.map((rfq) => {
        if (rfq.id === selectedRfq.id) {
          return {
            ...rfq,
            status: 'مكتمل',
            statusBg: '#E6F9F0',
            statusColor: '#009F65',
            bids: rfq.bids ? rfq.bids.map((b) =>
              b.provider === bid.provider ? { ...b, status: 'مقبول' } : b
            ) : []
          }
        }
        return rfq
      })
    )

    // 2. Set action notice with request title
    setActionNotice({
      type: 'accepted',
      title: `تم قبول عرض "${bid.provider}" بنجاح!`,
      subtitle: `لطلب: "${selectedRfq.title}" (${selectedRfq.id}) • بقيمة ${bid.price}`,
      rfqTitle: selectedRfq.title
    })
    setTimeout(() => setActionNotice(null), 5000)
  }

  const handleRejectBid = (bid) => {
    // 1. Update the bid status in rfqList
    setRfqList((prevRfqs) =>
      prevRfqs.map((rfq) => {
        if (rfq.id === selectedRfq.id) {
          return {
            ...rfq,
            bids: rfq.bids ? rfq.bids.map((b) =>
              b.provider === bid.provider ? { ...b, status: 'مرفوض' } : b
            ) : []
          }
        }
        return rfq
      })
    )

    // 2. Set action notice with request title
    setActionNotice({
      type: 'rejected',
      title: `تم رفض عرض "${bid.provider}"`,
      subtitle: `لطلب: "${selectedRfq.title}" (${selectedRfq.id})`,
      rfqTitle: selectedRfq.title
    })
    setTimeout(() => setActionNotice(null), 5000)
  }

  const handleCreateRfq = (e) => {
    e.preventDefault()
    if (!newTitle) return
    const newRfq = {
      id: `RFQ-2026-${Math.floor(450 + Math.random() * 50)}`,
      title: newTitle,
      type: 'بحري FCL',
      bidsCount: '0 عروض',
      route: `${newOrigin || 'شنغهاي'}   ${newDest || 'ميناء الملك عبد العزيز'}`,
      origin: newOrigin || 'شنغهاي - الصين',
      destination: newDest || 'ميناء الملك عبد العزيز - الدمام',
      weight: '20,000 كغ',
      budget: '$25,000-$35,000',
      deadline: '2026-10-30',
      date: '2026-11-02',
      status: 'مفتوح',
      statusType: 'open',
      statusBg: '#EBF5FE',
      statusColor: '#0284C7',
      bids: []
    }
    setRfqList([newRfq, ...rfqList])
    setSelectedRfqId(newRfq.id)
    setShowNewModal(false)
    setNewTitle('')
    setNewOrigin('')
    setNewDest('')
    setActionNotice('تم نشر طلب عرض السعر بنجاح!')
    setTimeout(() => setActionNotice(null), 3500)
  }

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner (Matching XD) */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-20"
        aria-hidden="true"
      ></div>

      {/* Importer Sidebar matching XD */}
      <ImporterSidebar activePath="/importer/rfq" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top Header Bar: Title on Right, Search & Bell on Left */}
        <header className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-xs flex items-center justify-between">
          {/* Right: Title & Subtitle + Orange Document Icon */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl border border-[#FB8731]/30 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#011222]">طلبات عروض الأسعار (RFQ)</h1>
              <p className="text-[11px] text-gray-400 font-medium">أرسل طلباتك واستقبل عروض مزودي الخدمة</p>
            </div>
          </div>

          {/* Left: Search input & Notifications bell */}
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

        {/* Action Notice Toast */}
        {actionNotice && (
          <div
            className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between text-white shadow-xl border animate-fade-in transition-all ${
              actionNotice.type === 'accepted'
                ? 'bg-[#011222] border-[#009F65]/50 shadow-green-950/20'
                : 'bg-[#011222] border-[#FB8731]/50 shadow-orange-950/20'
            }`}
          >
            <div className="flex items-center gap-3.5 text-right">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  actionNotice.type === 'accepted'
                    ? 'bg-[#009F65] text-white shadow-green-500/25'
                    : 'bg-[#FB8731] text-white shadow-orange-500/25'
                }`}
              >
                {actionNotice.type === 'accepted' ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : (
                  <X className="w-6 h-6 stroke-[3]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      actionNotice.type === 'accepted'
                        ? 'bg-[#009F65]/20 text-[#009F65] border border-[#009F65]/40'
                        : 'bg-[#FB8731]/20 text-[#FB8731] border border-[#FB8731]/40'
                    }`}
                  >
                    {actionNotice.type === 'accepted' ? 'إشعار قبول العرض' : 'إشعار رفض العرض'}
                  </span>
                  <h4 className="text-sm font-black text-white">{actionNotice.title}</h4>
                </div>
                <p className="text-xs text-white/80 font-medium mt-1">
                  {actionNotice.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActionNotice(null)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer mr-3 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sub-header / Filters & Add Button Row: Title on Right, Tabs Center, Button on Left */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
          {/* Right: Section Title & Active RFQ Count */}
          <div className="text-right">
            <h2 className="text-xl lg:text-2xl font-black text-[#011222]">طلبات عروض الأسعار (RFQ)</h2>
            <span className="text-xs text-gray-400 font-bold block mt-0.5">2 طلب نشط</span>
          </div>

          {/* Center: Filter Tabs Pill */}
          <div className="bg-white border border-gray-200/80 rounded-full p-1 flex items-center shadow-xs">
            {['الكل', 'مفتوح', 'قيد المراجعة', 'مكتمل'].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FB8731] text-white shadow-xs'
                      : 'text-gray-500 hover:text-[#011222]'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Left: + طلب جديد Button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="w-full md:w-auto bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold text-sm px-7 py-2.5 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <span>طلب جديد</span>
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </section>

        {/* Two Columns Grid matching screenshot */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Col 1-7): Selected RFQ Specs & Incoming Offers */}
          <div className="lg:col-span-7 space-y-6">
            {selectedRfq && (
              <>
                {/* Top Box: Selected RFQ Specs (شحن معدات بناء ثقيلة) */}
                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xs text-right">
                  <h3 className="text-base lg:text-lg font-black text-[#011222] mb-5">
                    {selectedRfq.title}
                  </h3>

                  {/* 6 Spec Tiles (3 columns x 2 rows) matching screenshot */}
                  <div className="grid grid-cols-3 gap-3.5">
                    {/* Row 1, Right: المنشأ */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 text-center flex flex-col justify-center items-center min-h-[90px]">
                      <span className="text-[11px] text-gray-400 font-bold block mb-1">المنشأ</span>
                      <span className="text-xs font-bold text-[#011222] block">{selectedRfq.origin}</span>
                    </div>

                    {/* Row 1, Middle: الوجهة */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 text-center flex flex-col justify-center items-center min-h-[90px]">
                      <span className="text-[11px] text-gray-400 font-bold block mb-1">الوجهة</span>
                      <span className="text-xs font-bold text-[#011222] block">{selectedRfq.destination}</span>
                    </div>

                    {/* Row 1, Left: النوع */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 text-center flex flex-col justify-center items-center min-h-[90px]">
                      <span className="text-[11px] text-gray-400 font-bold block mb-1">النوع</span>
                      <span className="text-xs font-bold text-[#011222] block">{selectedRfq.type}</span>
                    </div>

                    {/* Row 2, Right: الوزن */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 text-center flex flex-col justify-center items-center min-h-[90px]">
                      <span className="text-[11px] text-gray-400 font-bold block mb-1">الوزن</span>
                      <span className="text-xs font-bold text-[#011222] block">{selectedRfq.weight}</span>
                    </div>

                    {/* Row 2, Middle: الميزانية */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 text-center flex flex-col justify-center items-center min-h-[90px]">
                      <span className="text-[11px] text-gray-400 font-bold block mb-1">الميزانية</span>
                      <span className="text-xs font-bold text-[#011222] block font-sans">{selectedRfq.budget}</span>
                    </div>

                    {/* Row 2, Left: الموعد */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 text-center flex flex-col justify-center items-center min-h-[90px]">
                      <span className="text-[11px] text-gray-400 font-bold block mb-1">الموعد</span>
                      <span className="text-xs font-bold text-[#011222] block font-sans">{selectedRfq.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Box: العروض الواردة (Incoming Offers) matching screenshot */}
                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xs text-right">
                  <h3 className="text-base lg:text-lg font-black text-[#011222] mb-4">
                    العروض الواردة
                  </h3>

                  {selectedRfq.bids && selectedRfq.bids.length > 0 ? (
                    selectedRfq.bids.map((bid, index) => (
                      <div key={index} className="space-y-4">
                        {/* Offer Header Row: Price/Badge on Left, Provider/Rating/Avatar on Right */}
                        <div className="flex items-center justify-between">
                          {/* Left: Price and Waiting Badge */}
                          <div className="text-left">
                            <span className="text-2xl font-black text-[#011222] block leading-tight font-sans">
                              {bid.price}
                            </span>
                            <span
                              className={`px-3 py-0.5 rounded-full text-[11px] font-bold inline-block mt-1 ${
                                bid.status === 'مقبول'
                                  ? 'bg-[#E6F9F0] text-[#009F65]'
                                  : bid.status === 'مرفوض'
                                  ? 'bg-[#FEECEC] text-[#EF4444]'
                                  : 'bg-[#FFF3EA] text-[#FB8731]'
                              }`}
                            >
                              {bid.status}
                            </span>
                          </div>

                          {/* Right: Provider details & Avatar */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-xs font-black text-[#011222] block">
                                {bid.provider}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] text-gray-400 flex items-center gap-1 font-sans">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{bid.days}</span>
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] font-black text-gray-700">{bid.rating}</span>
                                  <div className="flex text-[#FBBF24]">
                                    {[...Array(bid.stars)].map((_, s) => (
                                      <Star key={s} className="w-3 h-3 fill-current" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Avatar Letter Box */}
                            <div className="w-11 h-11 rounded-2xl bg-gray-100 border border-gray-200/70 flex items-center justify-center text-gray-700 font-black text-sm shrink-0">
                              {bid.providerInitials}
                            </div>
                          </div>
                        </div>

                        {/* Note Strip matching screenshot */}
                        <div className="bg-[#F0F7FD] text-gray-500 text-xs py-2 px-4 rounded-xl text-right">
                          {bid.note}
                        </div>

                        {/* Action Buttons: قبول & رفض العرض matching screenshot */}
                        <div className="flex items-center gap-4 pt-2">
                          {bid.status === 'مقبول' ? (
                            <div className="w-full bg-[#E6F9F0] text-[#009F65] border border-[#009F65]/30 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-xs">
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>تم اعتماد وقبول هذا العرض رسمياً وجاري التنسيق مع المزود</span>
                            </div>
                          ) : bid.status === 'مرفوض' ? (
                            <div className="w-full bg-gray-100 text-gray-500 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-xs">
                              <X className="w-4 h-4" />
                              <span>تم استبعاد ورفض هذا العرض</span>
                            </div>
                          ) : (
                            <>
                              {/* Right Button: قبول (Green) */}
                              <button
                                onClick={() => handleAcceptBid(bid)}
                                className="flex-1 bg-[#009F65] hover:bg-[#008755] text-white font-bold text-sm py-3 px-6 rounded-2xl text-center transition-colors shadow-xs cursor-pointer active:scale-95"
                              >
                                قبول
                              </button>

                              {/* Left Button: رفض العرض (Orange/Red Border) */}
                              <button
                                onClick={() => handleRejectBid(bid)}
                                className="flex-1 bg-white hover:bg-orange-50 border border-[#FB8731]/60 text-[#FB8731] font-bold text-sm py-3 px-6 rounded-2xl text-center transition-colors cursor-pointer active:scale-95"
                              >
                                رفض العرض
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-xs">
                      لا توجد عروض واردة جديدة لهذا الطلب حالياً.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Column (Col 8-12): RFQ Cards List matching screenshot */}
          <div className="lg:col-span-5 space-y-4">
            {filteredRfqs.map((rfq) => {
              const isSelected = rfq.id === selectedRfqId
              return (
                <div
                  key={rfq.id}
                  onClick={() => setSelectedRfqId(rfq.id)}
                  className={`bg-white rounded-[24px] p-5 border transition-all duration-200 cursor-pointer text-right shadow-xs ${
                    isSelected
                      ? 'border-[#FB8731] ring-2 ring-[#FB8731]/20 shadow-md'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Top Row: Title on Right, Status Badge on Left */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Left: Status Pill */}
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: rfq.statusBg, color: rfq.statusColor }}
                    >
                      {rfq.status}
                    </span>

                    {/* Right: RFQ Title */}
                    <h4 className="text-sm font-black text-[#011222] truncate max-w-[220px]">
                      {rfq.title}
                    </h4>
                  </div>

                  {/* Middle Row: RFQ Code (Blue), Type, Bids count (Green) */}
                  <div className="flex items-center justify-end gap-3 text-xs mb-3 font-medium">
                    <span className="text-[#009F65] font-bold">{rfq.bidsCount}</span>
                    <span className="text-gray-500">{rfq.type}</span>
                    <span className="text-[#0284C7] font-bold font-sans">{rfq.id}</span>
                  </div>

                  {/* Bottom Row: Date on Left, Route on Right */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100/70 font-sans">
                    <span>{rfq.date}</span>
                    <span className="text-gray-500 font-almarai">{rfq.route}</span>
                  </div>
                </div>
              )
            })}
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

      {/* Modal: طلب عرض سعر جديد */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute left-6 top-6 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-[#011222] mb-1">إنشاء طلب عرض سعر جديد (RFQ)</h3>
            <p className="text-xs text-gray-400 mb-6">أدخل تفاصيل شحنتك ليصلك عروض أسعار تنافسية من المزودين</p>

            <form onSubmit={handleCreateRfq} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-gray-600 mb-1">عنوان الطلب / نوع البضاعة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شحن معدات هندسية"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1">المنشأ (مدينة / ميناء)</label>
                  <input
                    type="text"
                    placeholder="هامبورغ - ألمانيا"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">الوجهة (مدينة / ميناء)</label>
                  <input
                    type="text"
                    placeholder="ميناء جبل علي - دبي"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#FB8731] hover:bg-[#E06F1B] text-white py-3 rounded-xl font-bold transition-colors"
                >
                  نشر الطلب واستقبال العروض
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
