import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  X,
  Home,
  Users,
  Truck,
  Box,
  Wallet,
  Headphones,
  Settings,
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  CornerDownLeft
} from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'

// Comprehensive Platform Search Database matching all admin features
const PLATFORM_SEARCH_DATABASE = [
  // 1. Pages & Tools
  {
    category: 'أقسام وصفحات المنصة',
    type: 'page',
    title: 'لوحة التحكم والمؤشرات الرئيسية',
    desc: 'نظرة عامة على الإيرادات، المؤشرات المالية، وحركة البضائع على الخريطة',
    path: '/admin',
    icon: Home,
    iconColor: 'text-[#0284C7] bg-blue-50',
    keywords: ['لوحة', 'رئيسية', 'مؤشرات', 'احصائيات', 'خريطة', 'داشبورد', 'إيرادات', 'admin']
  },
  {
    category: 'أقسام وصفحات المنصة',
    type: 'page',
    title: 'إدارة المستخدمين والشركات',
    desc: 'التحكم بحسابات المستوردين، مزودي الخدمة، الناقلين، والصلاحيات',
    path: '/admin/users',
    icon: Users,
    iconColor: 'text-purple-600 bg-purple-50',
    keywords: ['مستخدمين', 'شركات', 'مستوردين', 'مزودين', 'صلاحيات', 'سارة', 'خالد', 'توثيق', 'users']
  },
  {
    category: 'أقسام وصفحات المنصة',
    type: 'page',
    title: 'غرفة القيادة والتحكم بالأسطول GPS',
    desc: 'التتبع المباشر للشاحنات على الخريطة، مسارات الرحلات، وتنبيهات الطوارئ',
    path: '/admin/fleet',
    icon: Truck,
    iconColor: 'text-[#FB8731] bg-orange-50',
    keywords: ['أسطول', 'شاحنات', 'تتبع', 'ملاحة', 'سائقين', 'طوارئ', 'مسار', 'gps', 'fleet']
  },
  {
    category: 'أقسام وصفحات المنصة',
    type: 'page',
    title: 'إدارة الشحنات والعمليات اللوجستية',
    desc: 'متابعة الشحنات البرية، البحرية، الجوية، وجداول التخليص الجمركي',
    path: '/admin/shipments',
    icon: Box,
    iconColor: 'text-[#009F65] bg-emerald-50',
    keywords: ['شحنات', 'بحرية', 'برية', 'جوية', 'جمارك', 'تخليص', 'بوالص', 'shipments']
  },
  {
    category: 'أقسام وصفحات المنصة',
    type: 'page',
    title: 'الإدارة المالية والفوترة والعمولات',
    desc: 'سجل العمولات المستحقة، المبالغ المعتمدة، الفواتير، والمستردات',
    path: '/admin/finance',
    icon: Wallet,
    iconColor: 'text-[#0284C7] bg-sky-50',
    keywords: ['مالية', 'فوترة', 'عمولات', 'أرباح', 'مدفوعات', 'حسابات', 'مبالغ', 'finance']
  },
  {
    category: 'أقسام وصفحات المنصة',
    type: 'page',
    title: 'مركز خدمة العملاء والدعم الفني',
    desc: 'نظام إدارة التذاكر، البلاغات العاجلة، وقنوات التواصل مع العملاء',
    path: '/admin/support',
    icon: Headphones,
    iconColor: 'text-rose-600 bg-rose-50',
    keywords: ['دعم', 'تذاكر', 'شكاوى', 'مساعدة', 'خدمة عملاء', 'تذكرة', 'support']
  },
  {
    category: 'أقسام وصفحات المنصة',
    type: 'page',
    title: 'إعدادات المنصة وسياسات التشغيل',
    desc: 'نسب العمولات، بوابات الرسائل SMS، Webhooks، والشروط والسياسات',
    path: '/admin/settings',
    icon: Settings,
    iconColor: 'text-slate-700 bg-slate-100',
    keywords: ['إعدادات', 'عمولة', 'رسائل', 'sms', 'سياسات', 'شروط', 'webhooks', 'settings']
  },

  // 2. Active Shipments
  {
    category: 'الشحنات المباشرة',
    type: 'shipment',
    title: 'شحنة رقم SHN-2026-884',
    desc: 'ميناء جدة الإسلامي ➔ الرياض (حاوية مبردة - شاحنة TRK-104)',
    path: '/admin/fleet',
    badge: 'متحركة',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: Truck,
    iconColor: 'text-emerald-600 bg-emerald-50',
    keywords: ['884', 'جدة', 'الرياض', 'SHN-2026-884', 'محمد وليد', 'مبردة']
  },
  {
    category: 'الشحنات المباشرة',
    type: 'shipment',
    title: 'شحنة رقم SHN-2026-966',
    desc: 'دبي ميناء جبل علي ➔ منفذ البطحاء (تفتيش جمركي - TRK-315)',
    path: '/admin/fleet',
    badge: 'تفتيش جمركي',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: Truck,
    iconColor: 'text-amber-600 bg-amber-50',
    keywords: ['966', 'دبي', 'البطحاء', 'جبل علي', 'SHN-2026-966', 'سامي المنصوري']
  },
  {
    category: 'الشحنات المباشرة',
    type: 'shipment',
    title: 'شحنة رقم SHN-2026-756',
    desc: 'ميناء جدة الإسلامي ➔ مكة المكرمة (شاحنة TRK-208)',
    path: '/admin/fleet',
    badge: 'استراحة نظامية',
    badgeColor: 'bg-sky-100 text-sky-800',
    icon: Truck,
    iconColor: 'text-sky-600 bg-sky-50',
    keywords: ['756', 'مكة', 'الحرمين', 'SHN-2026-756', 'أحمد فهد']
  },
  {
    category: 'الشحنات المباشرة',
    type: 'shipment',
    title: 'شحنة رقم SHN-2026-825',
    desc: 'الميناء الجاف بالرياض ➔ وادي الدواسر (عطل ميكانيكي - TRK-519)',
    path: '/admin/fleet',
    badge: 'معطلة / طوارئ',
    badgeColor: 'bg-red-100 text-red-800',
    icon: Truck,
    iconColor: 'text-red-600 bg-red-50',
    keywords: ['825', 'الرياض', 'وادي الدواسر', 'SHN-2026-825', 'سلطان الحربي']
  },
  {
    category: 'الشحنات المباشرة',
    type: 'shipment',
    title: 'شحنة قطع غيار إلكترونية ومعدات',
    desc: 'شنغهاي ➔ الرياض عبر الميناء الجاف (شركة النور للاستيراد)',
    path: '/admin/shipments',
    badge: 'قيد الشحن',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: Box,
    iconColor: 'text-blue-600 bg-blue-50',
    keywords: ['قطع غيار', 'شنغهاي', 'إلكترونية', 'شركة النور', 'معدات']
  },

  // 3. Users & Entities
  {
    category: 'المستخدمين والشركات المعتمدة',
    type: 'user',
    title: 'شركة النور للاستيراد والتصدير',
    desc: 'مستورد خدمة معتمد (سارة علي) - 48 عملية شحن ناجحة',
    path: '/admin/users',
    badge: 'نشط معتمد',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: Users,
    iconColor: 'text-[#0284C7] bg-blue-50',
    keywords: ['النور', 'سارة علي', 'مستورد', 'استيراد', 'شركة النور']
  },
  {
    category: 'المستخدمين والشركات المعتمدة',
    type: 'user',
    title: 'مؤسسة الرواد للخدمات اللوجستية',
    desc: 'مزود خدمة ونقل بري معتمد (خالد المنصوري) - أسطول 35 شاحنة',
    path: '/admin/users',
    badge: 'نشط معتمد',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: Users,
    iconColor: 'text-[#FB8731] bg-orange-50',
    keywords: ['الرواد', 'خالد المنصوري', 'مزود', 'لوجستية', 'مؤسسة الرواد']
  },
  {
    category: 'المستخدمين والشركات المعتمدة',
    type: 'driver',
    title: 'السائق: محمد وليد',
    desc: 'سائق أسطول TRK-104 (شحنة SHN-2026-884) - جوال: +966 50 847 2291',
    path: '/admin/fleet',
    badge: 'متصل الآن',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: Truck,
    iconColor: 'text-emerald-600 bg-emerald-50',
    keywords: ['محمد وليد', 'سائق', 'TRK-104', 'سائقين']
  },
  {
    category: 'المستخدمين والشركات المعتمدة',
    type: 'driver',
    title: 'السائق: سامي المنصوري',
    desc: 'سائق أسطول TRK-315 (شحنة SHN-2026-966) - جوال: +971 50 994 3821',
    path: '/admin/fleet',
    badge: 'في المنفذ',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: Truck,
    iconColor: 'text-amber-600 bg-amber-50',
    keywords: ['سامي المنصوري', 'سائق', 'TRK-315']
  },

  // 4. Support Tickets
  {
    category: 'تذاكر الدعم والعمليات',
    type: 'ticket',
    title: 'تذكرة #1001: مشكلة في الدفع عبر البطاقة',
    desc: 'العميل: شركة النور للاستيراد - الحالة: جديدة عاجلة',
    path: '/admin/support',
    badge: 'عاجلة',
    badgeColor: 'bg-red-100 text-red-800',
    icon: Headphones,
    iconColor: 'text-red-600 bg-red-50',
    keywords: ['1001', 'دفع', 'بطاقة', 'مشكلة', 'تذكرة']
  },
  {
    category: 'تذاكر الدعم والعمليات',
    type: 'ticket',
    title: 'تذكرة #1002: استفسار عن احتساب عمولة الترانزيت',
    desc: 'العميل: مؤسسة الخليج اللوجستية - الحالة: تم الحل',
    path: '/admin/support',
    badge: 'تم الحل',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: Headphones,
    iconColor: 'text-emerald-600 bg-emerald-50',
    keywords: ['1002', 'عمولة', 'ترانزيت', 'استفسار', 'تذكرة']
  }
]

export default function AdminHeader({
  title,
  searchPlaceholder = '..... البحث في المنصة',
  onSearch,
  searchValue = '',
  children
}) {
  const navigate = useNavigate()
  const { openNotifications } = useNotifications()
  const searchWrapperRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const [internalQuery, setInternalQuery] = useState('')

  // Current query is controlled or internal
  const currentQuery = searchValue !== undefined && searchValue !== '' ? searchValue : internalQuery

  const handleInputChange = (val) => {
    setInternalQuery(val)
    if (onSearch) {
      onSearch(val)
    }
    setIsOpen(true)
  }

  const handleClear = () => {
    setInternalQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  // Handle outside click & ESC key to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Filter items matching query
  const trimmedQuery = currentQuery.trim().toLowerCase()
  const filteredResults = PLATFORM_SEARCH_DATABASE.filter((item) => {
    if (!trimmedQuery) return false
    const matchTitle = item.title.toLowerCase().includes(trimmedQuery)
    const matchDesc = item.desc.toLowerCase().includes(trimmedQuery)
    const matchCategory = item.category.toLowerCase().includes(trimmedQuery)
    const matchKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(trimmedQuery))
    return matchTitle || matchDesc || matchCategory || matchKeywords
  })

  // Group filtered results by category
  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const handleSelectResult = (item) => {
    setIsOpen(false)
    navigate(item.path)
  }

  return (
    <header className="flex items-center justify-between gap-6 bg-white px-8 py-3.5 border-b border-gray-100 font-almarai sticky top-0 z-30" dir="rtl">
      
      {/* 1. Right Side in RTL: Interactive Search Bar with Live Command Dropdown */}
      <div ref={searchWrapperRef} className="relative w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={currentQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={`w-full bg-[#F4F6F9] border rounded-full py-2.5 pr-11 pl-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#FB8731] focus:bg-white transition-all text-right tracking-wide shadow-2xs ${
              isOpen ? 'border-[#FB8731] bg-white ring-2 ring-[#FB8731]/15' : 'border-gray-200/80'
            }`}
          />
          
          {/* Search Icon */}
          <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Clear Button */}
          {currentQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              title="مسح البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-block absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono bg-gray-200/60 px-1.5 py-0.5 rounded">
              Ctrl+K
            </span>
          )}
        </div>

        {/* ============================================================== */}
        {/* LIVE SEARCH RESULTS DROPDOWN (COMMAND PALETTE) */}
        {/* ============================================================== */}
        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-full sm:w-[500px] bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-150 z-50 overflow-hidden text-right animate-fade-in divide-y divide-gray-100">
            
            {/* Header / Stats */}
            <div className="p-3 bg-gray-50/70 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 text-[#011222] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#FB8731]" />
                {trimmedQuery
                  ? `نتائج البحث عن "${currentQuery}" (${filteredResults.length})`
                  : 'الاختصارات والصفحات الشائعة'}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">اضغط Esc للإغلاق</span>
            </div>

            {/* Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
              {/* When no query: Show Popular Shortcuts */}
              {!trimmedQuery && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 px-3 block mb-1">
                    أقسام المنصة السريعة
                  </span>
                  {PLATFORM_SEARCH_DATABASE.filter((i) => i.type === 'page').map((page) => {
                    const Icon = page.icon
                    return (
                      <button
                        key={page.path}
                        type="button"
                        onClick={() => handleSelectResult(page)}
                        className="w-full p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between gap-3 text-right transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${page.iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#011222] group-hover:text-[#FB8731] transition-colors">
                              {page.title}
                            </div>
                            <div className="text-[10px] text-gray-400 line-clamp-1">
                              {page.desc}
                            </div>
                          </div>
                        </div>
                        <CornerDownLeft className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#FB8731] transition-colors shrink-0" />
                      </button>
                    )
                  })}
                </div>
              )}

              {/* When typing & matches found: Grouped results */}
              {trimmedQuery && filteredResults.length > 0 && (
                Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 px-3 block mb-1">
                      {category} ({items.length})
                    </span>
                    {items.map((item, idx) => {
                      const Icon = item.icon || MapPin
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectResult(item)}
                          className="w-full p-2.5 rounded-xl hover:bg-orange-50/50 flex items-center justify-between gap-3 text-right transition-all cursor-pointer group border border-transparent hover:border-[#FED7AA]"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor || 'bg-gray-100 text-gray-600'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-[#011222] group-hover:text-[#FB8731] transition-colors truncate">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${item.badgeColor}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500 truncate mt-0.5 font-medium">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ArrowLeft className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#FB8731] group-hover:-translate-x-0.5 transition-all shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                ))
              )}

              {/* When typing & NO matches found */}
              {trimmedQuery && filteredResults.length === 0 && (
                <div className="text-center py-8 px-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-gray-700">
                    لم نجد أي نتائج مطابقة لـ "{currentQuery}"
                  </h4>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                    جرّب البحث باسم شاحنة (مثل 884)، اسم عميل، مسار (مثل جدة أو دبي)، أو صفحة معينة
                  </p>
                </div>
              )}
            </div>

            {/* Dropdown Footer Quick Link */}
            <div className="p-2.5 bg-gray-50/80 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-gray-400" />
                بحث شامل وفوري في بيانات المنصة
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  navigate('/admin/shipments')
                }}
                className="text-[#0284C7] hover:text-[#011222] font-bold transition-colors cursor-pointer"
              >
                انتقال إلى إدارة الشحنات ➔
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Title / Custom Actions slot (if any) */}
      {title && (
        <div className="hidden lg:block text-slate-700 font-black text-sm">
          {title}
        </div>
      )}

      {children}

      {/* 2. Left Side in RTL: User Profile & Notifications matching media_1794247160709_c92d6393.png */}
      <div className="flex items-center gap-4">
        {/* Profile Avatar & Info matching media_1794247160709_c92d6393.png */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <h4 className="text-sm font-black text-[#011222] leading-tight">
              أحمد المدير العام
            </h4>
            <p className="text-[11px] text-gray-400 font-bold">مدير المنصة</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-slate-300 flex items-center justify-center overflow-hidden text-slate-700">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Notifications Bell (on the far left) */}
        <button
          type="button"
          onClick={openNotifications}
          className="relative p-2 text-[#011222] hover:text-[#FB8731] transition-colors cursor-pointer"
          title="الإشعارات والتنبيهات"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
            3
          </span>
        </button>
      </div>
    </header>
  )
}
