/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  X,
  CheckCheck,
  Ship,
  FileText,
  DollarSign,
  AlertTriangle,
  Clock,
  Trash2,
  Settings,
  ChevronLeft
} from 'lucide-react'

export const initialNotifications = [
  {
    id: 'notif-1',
    category: 'shipments',
    title: 'صدور الفسح الجمركي للشحنة',
    message: 'تم إصدار الفسح الجمركي النهائي للشحنة رقم SHN-2026-884 في ميناء الملك عبدالعزيز بالدمام وجاهزة للتحميل.',
    time: 'منذ 15 دقيقة',
    date: 'اليوم، 09:45 م',
    unread: true,
    icon: Ship,
    iconBg: 'bg-[#E6F9F0]',
    iconColor: 'text-[#009F65]',
    link: '/dashboard/shipments'
  },
  {
    id: 'notif-2',
    category: 'rfq',
    title: 'عرض سعر جديد للمناقصة RFQ-884',
    message: 'قدمت شركة الأفق للشحن الدولي عرض سعر جديد بقيمة $3,450 لشحن 4 حاويات 40 قدم من جبل علي إلى الرياض.',
    time: 'منذ ساعة',
    date: 'اليوم، 08:30 م',
    unread: true,
    icon: FileText,
    iconBg: 'bg-[#EBF5FE]',
    iconColor: 'text-[#0284C7]',
    link: '/dashboard/rfq'
  },
  {
    id: 'notif-3',
    category: 'payments',
    title: 'تأكيد استلام دفعة مالية',
    message: 'تم تأكيد تحويل الدفعة المالية بقيمة $12,500 بنجاح عبر سداد للبوليصة INV-2026-441.',
    time: 'منذ 3 ساعات',
    date: 'اليوم، 06:15 م',
    unread: true,
    icon: DollarSign,
    iconBg: 'bg-[#FFF3EA]',
    iconColor: 'text-[#FB8731]',
    link: '/dashboard/payments'
  },
  {
    id: 'notif-4',
    category: 'shipments',
    title: 'تنبيه: تحديث موعد وصول السفينة',
    message: 'تحديث موعد رسو السفينة MSC OSCAR في ميناء جدة الإسلامي - الموعد المتوقع الجديد غداً الساعة 10:00 صباحاً.',
    time: 'منذ 6 ساعات',
    date: 'اليوم، 03:00 م',
    unread: false,
    icon: Clock,
    iconBg: 'bg-[#F0FDF4]',
    iconColor: 'text-[#009F65]',
    link: '/dashboard/shipments'
  },
  {
    id: 'notif-5',
    category: 'alerts',
    title: 'ملاحظة جمركية: مطلوب تفويض إلكتروني',
    message: 'يرجى تجديد التفويض الإلكتروني المعتمد عبر منصة فسح لإتمام إجراءات شحنة الأجهزة الكهربائية.',
    time: 'منذ يوم',
    date: 'أمس، 11:20 ص',
    unread: false,
    icon: AlertTriangle,
    iconBg: 'bg-[#FEF3C7]',
    iconColor: 'text-[#D97706]',
    link: '/dashboard/documents'
  }
]

export default function NotificationsModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeFilter, setActiveFilter] = useState('all')

  if (!isOpen) return null

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )
  }

  const deleteNotification = (e, id) => {
    e.stopPropagation()
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id)
    onClose()
    if (notif.link) {
      navigate(notif.link)
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return n.unread
    if (activeFilter === 'shipments') return n.category === 'shipments'
    if (activeFilter === 'rfq') return n.category === 'rfq'
    if (activeFilter === 'payments') return n.category === 'payments'
    return true
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-start sm:pr-80 pt-16 sm:pt-20 px-4 bg-[#011222]/50 backdrop-blur-xs transition-opacity animate-fade-in font-almarai"
      dir="rtl"
      onClick={onClose}
    >
      {/* Modal / Card Container */}
      <div
        className="bg-white rounded-[24px] shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-scale-in relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#011222] text-white p-5 px-6 flex items-center justify-between relative overflow-hidden">
          {/* Subtle Orange Accent Arc */}
          <div
            className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#FB8731]/30 blur-xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Left Actions: Close Button & Mark All */}
          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FB8731]/20 hover:bg-[#FB8731]/30 text-[#FB8731] text-xs font-bold transition-colors cursor-pointer"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تحديد كمقروء</span>
              </button>
            )}
          </div>

          {/* Right: Title & Unread Counter */}
          <div className="flex items-center gap-3 relative z-10 text-right">
            <div>
              <div className="flex items-center gap-2 justify-end">
                {unreadCount > 0 && (
                  <span className="bg-[#FB8731] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {unreadCount} جديد
                  </span>
                )}
                <h2 className="text-base font-black text-white">مركز الإشعارات</h2>
              </div>
              <p className="text-[11px] text-white/70 font-medium mt-0.5">
                متابعة فورية لعمليات الشحن والمناقصات والتخليص
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-[#FB8731] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-[#F8FAFC] border-b border-gray-100 p-2.5 px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'الكل', count: notifications.length },
            { id: 'unread', label: 'غير مقروءة', count: unreadCount },
            { id: 'shipments', label: 'الشحنات' },
            { id: 'rfq', label: 'عروض الأسعار' },
            { id: 'payments', label: 'المالية' }
          ].map((tab) => {
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#011222] text-white shadow-xs'
                    : 'text-[#64748B] hover:bg-gray-200/70'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`mr-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-[#FB8731] text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-bold text-[#011222]">لا توجد إشعارات حالياً</p>
              <p className="text-xs text-[#94A3B8]">ستظهر هنا كافة تحديثات الشحن والجمارك فور حدوثها</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const IconComp = notif.icon
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3.5 group relative text-right ${
                    notif.unread
                      ? 'bg-[#FFF8F3] hover:bg-[#FFF0E5] border border-[#FB8731]/20'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {/* Delete Button (visible on hover) */}
                  <button
                    onClick={(e) => deleteNotification(e, notif.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                    title="حذف الإشعار"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#94A3B8] font-medium font-mono shrink-0">
                        {notif.time}
                      </span>
                      <div className="flex items-center gap-1.5 min-w-0">
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#FB8731] shrink-0" />
                        )}
                        <h4 className="text-xs font-black text-[#011222] truncate">
                          {notif.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-[#475569] font-medium mt-1 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#FB8731] group-hover:underline">
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-sans">{notif.date}</span>
                    </div>
                  </div>

                  {/* Icon Box */}
                  <div
                    className={`w-10 h-10 rounded-xl ${notif.iconBg} ${notif.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F8FAFC] border-t border-gray-100 p-3 px-5 flex items-center justify-between text-xs font-bold text-[#64748B]">
          <button
            onClick={() => {
              onClose()
              navigate('/dashboard/settings')
            }}
            className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#011222] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>تفضيلات الإشعارات</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={() => setNotifications([])}
              className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              مسح الكل
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
