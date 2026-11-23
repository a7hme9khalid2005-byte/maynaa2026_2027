import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Zap,
  Ship,
  TrendingUp,
  BarChart3,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react'

const navItems = [
  { icon: LayoutGrid, label: 'لوحة القيادة', path: '/dashboard' },
  { icon: Zap, label: 'طلبات الأسعار (RFQ)', path: '/dashboard/rfq' },
  { icon: Ship, label: 'شحناتي', path: '/dashboard/shipments' },
  { icon: TrendingUp, label: 'التقييمات والاداء', path: '/dashboard/reviews' },
  { icon: BarChart3, label: 'المالية', path: '/dashboard/payments' },
  { icon: SettingsIcon, label: 'الاعدادات', path: '/dashboard/settings' },
]

export default function Sidebar({ activePath }) {
  const navigate = useNavigate()

  return (
    <aside className="w-[320px] shrink-0 h-screen bg-[#011222] flex flex-col fixed right-0 top-0 bottom-0 z-40 shadow-2xl border-l border-white/5 select-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Top Header & Logo matching XD */}
      <div className="pt-6 px-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <span className="text-white font-black text-2xl tracking-wider block leading-none font-sans">
              MEYNAA
            </span>
            <span className="text-[#FB8731] text-xs font-bold mt-1.5 block">مزود الخدمة</span>
          </div>
          <img
            src="/images/meynaa-logo.png"
            alt="MEYNAA ميناء"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Provider Box - Rectangle 60 (rgb 14,40,65) with dot and trend icon */}
      <div className="px-6 py-2">
        <div className="bg-[#0E2841] border border-blue-900/30 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]"></span>
            <span className="text-white text-xs font-bold block">شركة الأفق للشحن الدولي</span>
          </div>
          <div className="text-[#FB8731]">
            <TrendingUp className="w-4 h-4" />
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
          const isActive = activePath === item.path
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

      {/* Premium Plan Box - Rectangle 65 (rgb 16,38,62) */}
      <div className="px-6 py-3">
        <div className="bg-[#10263E] border border-blue-900/30 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[#FB8731] text-base font-black">
                خطة Premium
              </span>
              <Zap className="w-4 h-4 text-[#FB8731] fill-current" />
            </div>
          </div>
          <p className="text-[#AEAEAE] text-xs leading-relaxed mt-1 text-right">
            تقديم عروض غير محدودة + أولوية في الظهور
          </p>
        </div>
      </div>

      {/* User Profile Box - Rectangle 67 (rgb 15,23,42) */}
      <div className="p-4 mx-6 mb-5 bg-[#0F172A] border border-white/5 rounded-2xl flex items-center justify-between">
        <button
          onClick={() => navigate('/login')}
          title="تسجيل الخروج"
          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-white text-sm font-bold truncate">خالد العمري</p>
            <p className="text-white/60 text-xs mt-0.5">مدير عام</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white font-black text-base shrink-0 shadow-md">
            خع
          </div>
        </div>
      </div>
    </aside>
  )
}
