import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import {
  LayoutGrid,
  Ship,
  FileText,
  Wallet,
  Settings as SettingsIcon,
  Zap,
  LogOut
} from 'lucide-react'

const navItems = [
  { icon: LayoutGrid, label: 'لوحة القيادة', path: '/importer' },
  { icon: Zap, label: 'طلبات الأسعار (RFQ)', path: '/importer/rfq' },
  { icon: Ship, label: 'شحناتي', path: '/importer/shipments' },
  { icon: FileText, label: 'مستنداتي', path: '/importer/documents' },
  { icon: Wallet, label: 'المدفوعات', path: '/importer/payments' },
  { icon: SettingsIcon, label: 'الإعدادات', path: '/importer/settings' },
]

export default function ImporterSidebar({ activePath }) {
  const navigate = useNavigate()
  const { user: authUser, logout } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()

  const isDemoSarah = !currentUser || currentUser.email === 'importer@meynaa.com'
  const displayName = currentUser?.fullName || (isDemoSarah ? 'سارة الزاهرني' : 'العميل العزيز')
  const displayCompany = currentUser?.companyName || currentUser?.companyProfile?.companyNameAr || (isDemoSarah ? 'مجموعة الريادة للمقاولات' : 'منشأة تجارية معتمدة')
  const displayRole = isDemoSarah ? 'مديرة سلسلة التوريد' : 'صاحب المنشأة'

  const getInitials = (name) => {
    if (!name) return 'سز'
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2)
  }
  const initials = isDemoSarah ? 'سز' : getInitials(displayName)

  const handleLogout = () => {
    if (logout) {
      logout()
    } else {
      authService.logout()
    }
    navigate('/login')
  }

  return (
    <aside className="w-[320px] shrink-0 h-screen bg-[#011222] flex flex-col fixed right-0 top-0 bottom-0 z-40 shadow-2xl border-l border-white/5 select-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Top Header & Logo */}
      <div className="pt-6 px-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <span className="text-white font-black text-2xl tracking-wider block leading-none font-sans">
              MEYNAA
            </span>
            <span className="text-[#FB8731] text-xs font-bold mt-1.5 block">مستورد الخدمة</span>
          </div>
          <img
            src="/images/meynaa-logo.png"
            alt="MEYNAA ميناء"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Importer Company Box */}
      <div className="px-6 py-2">
        <div className="bg-[#0E2841] border border-blue-900/30 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731] shrink-0"></span>
            <span className="text-white text-xs font-bold block truncate max-w-[240px]" title={displayCompany}>
              {displayCompany}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Section Header */}
      <div className="px-7 pt-4 pb-1">
        <span className="text-[#777777] text-xs font-bold block">القائمة الرئيسية</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            activePath === item.path ||
            (item.path === '/importer' && (activePath === '/importer' || activePath === '/importer/dashboard'))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#0F2D47] text-white font-bold shadow-md'
                  : 'text-[#94A3B8] hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              {/* Left indicator bar on active item matching XD screenshot */}
              {isActive ? (
                <span className="w-1.5 h-6 bg-[#FB8731] rounded-full shrink-0"></span>
              ) : (
                <span className="w-1.5"></span>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm">{item.label}</span>
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-[#FB8731]' : 'text-[#777777] group-hover:text-white'
                  }`}
                />
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Enterprise Plan Box */}
      <div className="px-6 py-3">
        <div className="bg-[#10263E] border border-blue-900/30 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[#FB8731] text-base font-black">
                خطة Enterprise
              </span>
              <Zap className="w-4 h-4 text-[#FB8731] fill-current" />
            </div>
          </div>
          <p className="text-[#AEAEAE] text-xs leading-relaxed mt-1 text-right">
            وصول كامل لجميع مزودي الخدمة في المنصة
          </p>
        </div>
      </div>

      {/* User Profile Box */}
      <div className="p-4 mx-6 mb-5 bg-[#0F172A] border border-white/5 rounded-2xl flex items-center justify-between">
        <button
          onClick={handleLogout}
          title="تسجيل الخروج"
          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-right overflow-hidden">
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate max-w-[150px]" title={displayName}>
              {displayName}
            </p>
            <p className="text-white/60 text-xs mt-0.5 truncate max-w-[150px]">
              {displayRole}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white font-black text-base shrink-0 shadow-md">
            {initials}
          </div>
        </div>
      </div>
    </aside>
  )
}
