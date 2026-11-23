import { Link, useNavigate } from 'react-router-dom'
import {
  Home,
  Users,
  SlidersHorizontal,
  Truck,
  Wallet,
  Headphones,
  Settings,
  LogOut
} from 'lucide-react'

const adminNavItems = [
  { icon: Home, label: 'لوحة التحكم', path: '/admin' },
  { icon: Users, label: 'إدارة المستخدمين', path: '/admin/users' },
  { icon: SlidersHorizontal, label: 'غرفة القيادة و التحكم بالأسطول', path: '/admin/fleet' },
  { icon: Truck, label: 'إدارة الشحنات', path: '/admin/shipments' },
  { icon: Wallet, label: 'الإدارة المالية و الفوترة', path: '/admin/finance' },
  { icon: Headphones, label: 'مركز خدمة العملاء والدعم الفني', path: '/admin/support' },
  { icon: Settings, label: 'إعدادات المنصة', path: '/admin/settings' },
]

export default function AdminSidebar({ activePath = '/admin' }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <aside
      className="w-[280px] shrink-0 h-screen bg-[#011222] flex flex-col fixed right-0 top-0 bottom-0 z-40 shadow-2xl border-l border-white/5 select-none font-almarai overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      dir="rtl"
    >
      {/* Top Logo matching screenshot */}
      <div className="pt-8 px-6 pb-6 flex flex-col items-center justify-center border-b border-white/5">
        <Link to="/admin" className="flex flex-col items-center group">
          <img
            src="/images/meynaa-logo.png"
            alt="MEYNAA ميناء"
            className="w-14 h-14 object-contain transition-transform group-hover:scale-105"
          />
          <div className="text-center mt-2">
            <span className="text-white font-black text-xl tracking-wider block leading-none font-sans">
              MEYNAA
            </span>
            <span className="text-[#FB8731] text-[11px] font-bold mt-1 block">
              لوحة تحكم الإدارة العامة
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Menu matching screenshot */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activePath === item.path || (item.path === '/admin' && activePath === '/admin/dashboard')

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-[#FB8731] text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-white/60'}`} />
              <span className="leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions: Logout matching design */}
      <div className="p-4 border-t border-white/5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-[#02182E] hover:bg-[#032240] border border-white/10 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm group"
        >
          <LogOut className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
