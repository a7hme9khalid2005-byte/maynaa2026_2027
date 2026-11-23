import { useState } from 'react'
import AdminSidebar from '../../../components/dashboard/AdminSidebar'
import AdminHeader from '../../../components/dashboard/AdminHeader'
import {
  Clock,
  Check,
  Ticket,
  Send,
  Megaphone,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  X,
  UserCheck
} from 'lucide-react'

// Initial Tickets Data matching screenshot
const initialTickets = [
  {
    id: '#1001',
    subject: 'مشكلة في الدفع',
    priority: 'حرجة',
    priorityClass: 'bg-rose-50 text-rose-600 border border-rose-200/80',
    status: 'جديدة',
    statusClass: 'bg-sky-50 text-sky-600 border border-sky-200/80',
    date: '2026/8/4 - 10:30 PM',
    agent: 'سارة علي',
    client: 'شركة النور للاستيراد',
    content: 'واجهنا خطأ أثناء إتمام عملية الدفع عبر بطاقة الائتمان للطلب رقم ORD-884.'
  },
  {
    id: '#1002',
    subject: 'استفسار عن عمولة',
    priority: 'متوسطة',
    priorityClass: 'bg-amber-50 text-amber-600 border border-amber-200/80',
    status: 'تم الحل',
    statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    date: '2026/8/3 - 11:30 PM',
    agent: 'محمد أحمد',
    client: 'مؤسسة الخليج اللوجستية',
    content: 'استفسار حول آلية احتساب نسبة العمولة لعمليات النقل البري الترانزيت.'
  },
  {
    id: '#1003',
    subject: 'طلب سحب أرباح',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80',
    status: 'قيد المعالجة',
    statusClass: 'bg-orange-50 text-[#FB8731] border border-orange-200/80',
    date: '2026/8/2 - 9:30 PM',
    agent: 'دينا محمود',
    client: 'شركة المشرق للنقل',
    content: 'طلب تحويل رصيد الأرباح المتراكم لحسابنا البنكي المعتمد.'
  },
  {
    id: '#1004',
    subject: 'مشكلة في الشحنات',
    priority: 'متوسطة',
    priorityClass: 'bg-amber-50 text-amber-600 border border-amber-200/80',
    status: 'بانتظار العميل',
    statusClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200/80',
    date: '2026/8/4 - 11:30 PM',
    agent: 'عمر خالد',
    client: 'أساطيل الخليج اللوجستية',
    content: 'تأخر التفتيش الجمركي في منفذ البطحاء للشاحنة رقم TRK-315.'
  },
  {
    id: '#1005',
    subject: 'استفسار عن الفواتير',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80',
    status: 'جديدة',
    statusClass: 'bg-sky-50 text-sky-600 border border-sky-200/80',
    date: '2026/8/5 - 11:30 PM',
    agent: 'عمر حسن',
    client: 'العالمية السريعة للشحن',
    content: 'نحتاج نسخة موقعة من الفاتورة الضريبية لشهر يوليو 2026.'
  }
]

// Unified Inbox Data matching screenshot across pages
const initialInbox = [
  // Page 1
  {
    id: 1,
    type: 'chat',
    sender: 'حسن أحمد',
    message: 'أريد الاستفسار عن رسوم الشحن',
    status: 'جديدة',
    statusClass: 'bg-rose-50 text-rose-600 border border-rose-200/80',
    time: 'اليوم 9:30 ص',
    priority: 'حرجة',
    priorityClass: 'bg-rose-50 text-rose-600 border border-rose-200/80'
  },
  {
    id: 2,
    type: 'call',
    sender: 'شركة المقاولات',
    message: 'هل يمكن تتبع الشاحنة رقم: TRK-104',
    status: 'مقروءة',
    statusClass: 'bg-sky-50 text-sky-600 border border-sky-200/80',
    time: 'اليوم 8:10 ص',
    priority: 'متوسطة',
    priorityClass: 'bg-amber-50 text-amber-600 border border-amber-200/80'
  },
  {
    id: 3,
    type: 'chat',
    sender: 'خالد وليد',
    message: 'شكراً على المساعدة',
    status: 'مغلقة',
    statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    time: 'أمس 11:20 م',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  },
  {
    id: 4,
    type: 'call',
    sender: 'سارة محمود',
    message: 'متى سيتم تسليم الشحنة',
    status: 'بانتظار الرد',
    statusClass: 'bg-orange-50 text-[#FB8731] border border-orange-200/80',
    time: 'أمس 5:20 م',
    priority: 'قيد المعالجة',
    priorityClass: 'bg-orange-50 text-[#FB8731] border border-orange-200/80'
  },
  {
    id: 5,
    type: 'chat',
    sender: 'شركة النقل السريع',
    message: 'تم حل المشكلة شكراً لكم',
    status: 'مغلقة',
    statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    time: 'أمس 10:50 ص',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  },

  // Page 2
  {
    id: 6,
    type: 'call',
    sender: 'مؤسسة الأفق اللوجستية',
    message: 'استفسار حول تحديث بوليصة الشحن الجوي رقم AWB-4401',
    status: 'جديدة',
    statusClass: 'bg-rose-50 text-rose-600 border border-rose-200/80',
    time: 'منذ يومين',
    priority: 'حرجة',
    priorityClass: 'bg-rose-50 text-rose-600 border border-rose-200/80'
  },
  {
    id: 7,
    type: 'chat',
    sender: 'ماجد عبد الرحمن',
    message: 'لم يتم تفعيل حساب المخلص الجمركي حتى الآن',
    status: 'بانتظار الرد',
    statusClass: 'bg-orange-50 text-[#FB8731] border border-orange-200/80',
    time: 'منذ يومين',
    priority: 'متوسطة',
    priorityClass: 'bg-amber-50 text-amber-600 border border-amber-200/80'
  },
  {
    id: 8,
    type: 'call',
    sender: 'شركة الشرق الأوسط للتجارة',
    message: 'طلب تعديل عنوان التسليم للشحنة رقم SHN-2026-902',
    status: 'مقروءة',
    statusClass: 'bg-sky-50 text-sky-600 border border-sky-200/80',
    time: 'منذ 3 أيام',
    priority: 'متوسطة',
    priorityClass: 'bg-amber-50 text-amber-600 border border-amber-200/80'
  },
  {
    id: 9,
    type: 'chat',
    sender: 'نورة القحطاني',
    message: 'تم استلام الشحنة بحالة ممتازة في مستودع الدمام',
    status: 'مغلقة',
    statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    time: 'منذ 3 أيام',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  },
  {
    id: 10,
    type: 'call',
    sender: 'الموانئ البحرية الموحدة',
    message: 'إشعار بجاهزية الحاوية للتفريغ في ميناء الملك فهد',
    status: 'مقروءة',
    statusClass: 'bg-sky-50 text-sky-600 border border-sky-200/80',
    time: 'منذ 4 أيام',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  },

  // Page 3
  {
    id: 11,
    type: 'chat',
    sender: 'فهد الدوسري',
    message: 'استفسار عن تغطية التأمين على الشحنات المبردة الدولية',
    status: 'جديدة',
    statusClass: 'bg-rose-50 text-rose-600 border border-rose-200/80',
    time: 'منذ 4 أيام',
    priority: 'متوسطة',
    priorityClass: 'bg-amber-50 text-amber-600 border border-amber-200/80'
  },
  {
    id: 12,
    type: 'call',
    sender: 'شركة سلاسل الإمداد الحديثة',
    message: 'طلب كشف حساب بالفواتير الضريبية المدفوعة لشهر يونيو',
    status: 'مغلقة',
    statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    time: 'منذ 5 أيام',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  },
  {
    id: 13,
    type: 'chat',
    sender: 'يوسف المنصور',
    message: 'هل يمكن تفعيل التنبيهات اللحظية عبر الرسائل القصيرة SMS؟',
    status: 'مقروءة',
    statusClass: 'bg-sky-50 text-sky-600 border border-sky-200/80',
    time: 'منذ 5 أيام',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  },
  {
    id: 14,
    type: 'call',
    sender: 'شركة الأمانة للشحن البري',
    message: 'تم تجديد تصاريح هيئة النقل لجميع شاحنات الأسطول',
    status: 'مغلقة',
    statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    time: 'منذ أسبوع',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  },
  {
    id: 15,
    type: 'chat',
    sender: 'ريم السليمان',
    message: 'شكراً جزيلاً لفريق الدعم على المتابعة والحل السريع',
    status: 'مغلقة',
    statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    time: 'منذ أسبوع',
    priority: 'عادية',
    priorityClass: 'bg-blue-50 text-blue-600 border border-blue-200/80'
  }
]

export default function AdminSupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tickets, setTickets] = useState(initialTickets)
  const [selectedTicketIds, setSelectedTicketIds] = useState([])
  const [inboxTab, setInboxTab] = useState('all') // 'all', 'call', 'chat'
  const [inbox] = useState(initialInbox)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const [broadcastText, setBroadcastText] = useState('')
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [activeTicketModal, setActiveTicketModal] = useState(null)
  const [ticketReplyText, setTicketReplyText] = useState('')
  const [activeMessageModal, setActiveMessageModal] = useState(null)
  const [messageReplyText, setMessageReplyText] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  // Toggle ticket checkbox
  const handleToggleSelectTicket = (id) => {
    if (selectedTicketIds.includes(id)) {
      setSelectedTicketIds(selectedTicketIds.filter((item) => item !== id))
    } else {
      setSelectedTicketIds([...selectedTicketIds, id])
    }
  }

  // Select / Deselect all tickets
  const handleToggleSelectAll = () => {
    if (selectedTicketIds.length === tickets.length) {
      setSelectedTicketIds([])
    } else {
      setSelectedTicketIds(tickets.map((t) => t.id))
    }
  }

  // Send Broadcast Notification
  const handleSendBroadcast = (e) => {
    e.preventDefault()
    if (!broadcastText.trim()) {
      showToast('يرجى كتابة نص الإشعار أولاً')
      return
    }

    setIsSendingBroadcast(true)
    setTimeout(() => {
      setIsSendingBroadcast(false)
      setBroadcastText('')
      showToast('تم إرسال الإشعار الجماعي بنجاح إلى جميع مستخدمي المنصة')
    }, 700)
  }

  // Handle Ticket Reply
  const handleTicketReply = (e) => {
    e.preventDefault()
    if (!activeTicketModal || !ticketReplyText.trim()) return

    const updated = tickets.map((t) => {
      if (t.id === activeTicketModal.id) {
        return {
          ...t,
          status: 'تم الحل',
          statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
        }
      }
      return t
    })

    setTickets(updated)
    showToast(`تم الرد على التذكرة ${activeTicketModal.id} وتغيير حالتها إلى "تم الحل"`)
    setActiveTicketModal(null)
    setTicketReplyText('')
  }

  // Handle Message Reply
  const handleSendMessageReply = (e) => {
    e.preventDefault()
    if (!activeMessageModal || !messageReplyText.trim()) return

    showToast(`تم إرسال الرد بنجاح إلى ${activeMessageModal.sender}`)
    setActiveMessageModal(null)
    setMessageReplyText('')
  }

  // Filtered inbox based on tab
  const filteredInbox = inbox.filter((item) => {
    if (inboxTab === 'call') return item.type === 'call'
    if (inboxTab === 'chat') return item.type === 'chat'
    return true
  })

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredInbox.length / pageSize))
  const paginatedInbox = filteredInbox.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleTabChange = (tab) => {
    setInboxTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-almarai flex" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#011222] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FB8731]/40 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#009F65]" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Ticket Details & Reply Modal */}
      {activeTicketModal && (
        <div className="fixed inset-0 bg-[#011222]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 lg:p-8 shadow-2xl border border-gray-100 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FB8731] flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#011222] text-base">
                    تفاصيل التذكرة {activeTicketModal.id}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">{activeTicketModal.client}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTicketModal(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">موضوع التذكرة:</span>
                <span className="font-bold text-[#011222]">{activeTicketModal.subject}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">الموظف المسؤول:</span>
                <span className="font-bold text-[#0284C7]">{activeTicketModal.agent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">تاريخ الإنشاء:</span>
                <span className="font-bold text-gray-600 dir-ltr">{activeTicketModal.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">الأولوية:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${activeTicketModal.priorityClass}`}>
                  {activeTicketModal.priority}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200/80">
                <p className="text-gray-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-gray-200/70">
                  {activeTicketModal.content}
                </p>
              </div>
            </div>

            <form onSubmit={handleTicketReply} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  كتابة رد الدعم الفني:
                </label>
                <textarea
                  rows="3"
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  placeholder="اكتب ردك هنا على العميل..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-[#011222] placeholder-gray-400 focus:outline-none focus:border-[#FB8731] resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#011222] hover:bg-[#02203d] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#011222]/20"
                >
                  <Send className="w-4 h-4 text-[#FB8731]" />
                  <span>إرسال الرد وإغلاق التذكرة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTicketModal(null)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message / Call Modal */}
      {activeMessageModal && (
        <div className="fixed inset-0 bg-[#011222]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 lg:p-8 shadow-2xl border border-gray-100 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0284C7] flex items-center justify-center">
                  {activeMessageModal.type === 'call' ? <Phone className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-black text-[#011222] text-base">{activeMessageModal.sender}</h3>
                  <p className="text-[11px] text-gray-400 font-medium">{activeMessageModal.time}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessageModal(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">نوع القناة:</span>
                <span className="font-bold text-[#011222]">
                  {activeMessageModal.type === 'call' ? 'مكالمة هاتفية / طلب معاودة اتصال' : 'محادثة دعم فوري'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">الحالة:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${activeMessageModal.statusClass}`}>
                  {activeMessageModal.status}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200/80">
                <p className="text-gray-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-gray-200/70">
                  {activeMessageModal.message}
                </p>
              </div>
            </div>

            <form onSubmit={handleSendMessageReply} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  الرد على الرسالة:
                </label>
                <textarea
                  rows="3"
                  value={messageReplyText}
                  onChange={(e) => setMessageReplyText(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-[#011222] placeholder-gray-400 focus:outline-none focus:border-[#FB8731] resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#011222] hover:bg-[#02203d] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#011222]/20"
                >
                  <Send className="w-4 h-4 text-[#FB8731]" />
                  <span>إرسال الرد</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMessageModal(null)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar activePath="/admin/support" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[280px] flex flex-col min-h-screen select-none overflow-x-hidden">
        {/* Top Header Bar pinned edge-to-edge matching screenshot */}
        <AdminHeader searchValue={searchQuery} onSearch={setSearchQuery} />

        {/* Inner Content Area */}
        <div className="p-6 lg:p-8 space-y-6">
          {/* Page Title matching screenshot */}
          <div className="text-right">
            <h1 className="text-2xl font-black text-[#011222] tracking-tight">مركز خدمة العملاء و الدعم الفني</h1>
          </div>

          {/* Top 4 Support KPI Metric Cards with Harmonized Translucent Tinted Backgrounds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 (Right in RTL): عاجلة (Translucent Sky Blue Tint) */}
            <div className="bg-[#F0F9FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#BAE6FD]/70 hover:border-[#0284C7]/50 shadow-[0_2px_12px_rgba(2,132,199,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#0369A1] mb-1">عاجلة</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">40</h3>
                <p className="text-xs font-bold text-[#009F65] mt-1 font-mono">8%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
                <span className="font-black text-2xl leading-none text-[#0284C7]">!</span>
              </div>
            </div>

            {/* Card 2: قيد المعالجة (Translucent Meynaa Orange Tint) */}
            <div className="bg-[#FFF7ED]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#FED7AA]/70 hover:border-[#FB8731]/50 shadow-[0_2px_12px_rgba(251,135,49,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#C2410C] mb-1">قيد المعالجة</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">76</h3>
                <p className="text-xs font-bold text-[#009F65] mt-1 font-mono">6%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#FED7AA] text-[#FB8731] flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 3: تم الحل (Translucent Emerald Green Tint) */}
            <div className="bg-[#ECFDF5]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#A7F3D0]/70 hover:border-[#009F65]/50 shadow-[0_2px_12px_rgba(0,159,101,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#047857] mb-1">تم الحل</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">1,132</h3>
                <p className="text-xs font-bold text-[#009F65] mt-1 font-mono">14%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#A7F3D0] text-[#009F65] flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
            </div>

            {/* Card 4 (Left in RTL): إجمالي التذاكر (Translucent Purple Tint) */}
            <div className="bg-[#F5F3FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#DDD6FE]/70 hover:border-[#7C3AED]/50 shadow-[0_2px_12px_rgba(124,58,237,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#6D28D9] mb-1">إجمالي التذاكر</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">1,248</h3>
                <p className="text-xs font-bold text-[#009F65] mt-1 font-mono">12%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-xs">
                <Ticket className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* Section 1: Middle Grid - Technical Support Tickets Table + Bulk Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Right Column (in RTL - 8 cols): نظام تذاكر الدعم الفني */}
            <div className="lg:col-span-8 space-y-3">
              {/* Header Dark Pill */}
              <div className="flex justify-start">
                <div className="bg-[#011222] text-white px-7 py-2 rounded-2xl text-xs font-black shadow-md shadow-[#011222]/15">
                  نظام تذاكر الدعم الفني
                </div>
              </div>

              {/* Tickets Table Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                      <th className="py-3 px-3 text-center w-10">
                        <input
                          type="checkbox"
                          checked={selectedTicketIds.length === tickets.length}
                          onChange={handleToggleSelectAll}
                          className="rounded border-gray-300 text-[#FB8731] focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3 text-right">#</th>
                      <th className="py-3 px-3 text-right">رقم التذاكر</th>
                      <th className="py-3 px-3 text-center">عنوان الأولوية</th>
                      <th className="py-3 px-3 text-center">الحالة</th>
                      <th className="py-3 px-3 text-center">تاريخ الإنشاء</th>
                      <th className="py-3 px-3 text-left">الموظف المسؤول</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tickets.map((t) => {
                      const isChecked = selectedTicketIds.includes(t.id)
                      return (
                        <tr
                          key={t.id}
                          onClick={() => setActiveTicketModal(t)}
                          className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                            isChecked ? 'bg-orange-50/20' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td
                            className="py-3.5 px-3 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectTicket(t.id)}
                              className="rounded border-gray-300 text-[#FB8731] focus:ring-0 cursor-pointer"
                            />
                          </td>

                          {/* ID */}
                          <td className="py-3.5 px-3 font-bold text-gray-700 font-mono text-right">
                            {t.id}
                          </td>

                          {/* Subject */}
                          <td className="py-3.5 px-3 font-bold text-[#011222] text-right">
                            {t.subject}
                          </td>

                          {/* Priority */}
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${t.priorityClass}`}
                            >
                              {t.priority}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${t.statusClass}`}
                            >
                              {t.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-3 text-gray-500 font-medium dir-ltr text-center font-mono">
                            {t.date}
                          </td>

                          {/* Agent */}
                          <td className="py-3.5 px-3 font-semibold text-gray-700 text-left">
                            {t.agent}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Left Column (in RTL - 4 cols): الإشعارات الجماعية (Broadcast Announcements) */}
            <div className="lg:col-span-4 bg-[#F0F6FB] rounded-3xl p-6 border border-sky-100/70 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-200/50">
                  <div className="text-right">
                    <h3 className="text-sm font-black text-[#011222]">الإشعارات الجماعية</h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      أرسل إشعاراً لجميع المستخدمين
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#0284C7] flex items-center justify-center shadow-xs">
                    <Megaphone className="w-5 h-5" />
                  </div>
                </div>

                {/* Form Input */}
                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <textarea
                    rows="6"
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    placeholder="اكتب رسالتك هنا......"
                    className="w-full bg-white border border-sky-100 rounded-2xl p-4 text-xs text-[#011222] placeholder-gray-400 focus:outline-none focus:border-[#FB8731] focus:ring-2 focus:ring-orange-100 shadow-2xs resize-none"
                  ></textarea>

                  <div className="flex justify-start">
                    <button
                      type="submit"
                      disabled={isSendingBroadcast}
                      className="bg-[#011222] hover:bg-[#02203d] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#011222]/20 active:scale-95 disabled:opacity-75 cursor-pointer"
                    >
                      {isSendingBroadcast ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>جاري الإرسال...</span>
                        </>
                      ) : (
                        <>
                          <span>إرسال الإشعار</span>
                          <Send className="w-3.5 h-3.5 text-white" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-200/50 flex items-center gap-2 text-[11px] text-gray-600">
                <UserCheck className="w-4 h-4 text-[#009F65]" />
                <span>يصل الإشعار فورياً إلى 1,250 مستخدم وناقل نشط</span>
              </div>
            </div>
          </div>

          {/* Section 2: Bottom Grid - Unified Inbox (صندوق الوارد الموحد) */}
          <div className="space-y-3">
            {/* Header Tabs matching screenshot (Aligned Right in RTL) */}
            <div className="flex flex-wrap items-center justify-start gap-2.5">
              {/* Header Dark Pill: صندوق الوارد الموحد on the Right */}
              <div className="bg-[#011222] text-white px-7 py-2 rounded-2xl text-xs font-black shadow-md shadow-[#011222]/15">
                صندوق الوارد الموحد
              </div>

              {/* Tab 1: كل الرسائل (Active) */}
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`px-5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  inboxTab === 'all'
                    ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>كل الرسائل</span>
              </button>

              {/* Tab 2: اتصل بنا */}
              <button
                type="button"
                onClick={() => handleTabChange('call')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  inboxTab === 'call'
                    ? 'bg-[#0284C7] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Phone className={`w-3.5 h-3.5 ${inboxTab === 'call' ? 'text-white' : 'text-gray-700'}`} />
                <span>اتصل بنا</span>
              </button>

              {/* Tab 3: محادثات المساعدة */}
              <button
                type="button"
                onClick={() => handleTabChange('chat')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  inboxTab === 'chat'
                    ? 'bg-[#0284C7] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageSquare className={`w-3.5 h-3.5 ${inboxTab === 'chat' ? 'text-white' : 'text-[#0284C7]'}`} />
                <span>محادثات المساعدة</span>
              </button>
            </div>

            {/* Unified Inbox Container Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                      <th className="py-3 px-3 text-center w-12"></th>
                      <th className="py-3 px-4 text-right">الاسم</th>
                      <th className="py-3 px-4 text-center">الحالة</th>
                      <th className="py-3 px-4 text-center">تاريخ الإرسال</th>
                      <th className="py-3 px-4 text-center">الأولوية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedInbox.map((msg) => (
                      <tr
                        key={msg.id}
                        onClick={() => setActiveMessageModal(msg)}
                        className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                      >
                        {/* Type Icon */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0284C7] mx-auto">
                            {msg.type === 'call' ? (
                              <Phone className="w-3.5 h-3.5" />
                            ) : (
                              <MessageSquare className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </td>

                        {/* Sender and Message */}
                        <td className="py-3.5 px-4 text-right">
                          <div>
                            <h4 className="font-bold text-[#011222] text-xs mb-0.5">{msg.sender}</h4>
                            <p className="text-[11px] text-gray-400 font-medium">{msg.message}</p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${msg.statusClass}`}
                          >
                            {msg.status}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="py-3.5 px-4 text-gray-500 font-medium text-center font-mono">
                          {msg.time}
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${msg.priorityClass}`}
                          >
                            {msg.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination matching screenshot media_1794245812038_77c69f32.png */}
              <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-4 text-xs">
                {/* Page buttons */}
                <div className="flex items-center gap-1.5 select-none">
                  {/* Next / Right arrow (Previous page in Arabic) */}
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs cursor-pointer transition-all active:scale-95"
                    title="الصفحة السابقة"
                  >
                    »
                  </button>

                  {/* Page 1 */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(1)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                      currentPage === 1
                        ? 'bg-[#0284C7] text-white shadow-sm border border-[#0284C7]'
                        : 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    1
                  </button>

                  {/* Page 2 */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(2)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                      currentPage === 2
                        ? 'bg-[#0284C7] text-white shadow-sm border border-[#0284C7]'
                        : 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    2
                  </button>

                  {/* Page 3 */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(3)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                      currentPage === 3
                        ? 'bg-[#0284C7] text-white shadow-sm border border-[#0284C7]'
                        : 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    3
                  </button>

                  {/* Prev / Left arrow (Next page in Arabic) */}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs cursor-pointer transition-all active:scale-95"
                    title="الصفحة التالية"
                  >
                    «
                  </button>
                </div>

                {/* Page Count */}
                <span className="text-gray-400 font-medium">
                  عرض {currentPage} من {totalPages} (إجمالي 50 رسالة)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
