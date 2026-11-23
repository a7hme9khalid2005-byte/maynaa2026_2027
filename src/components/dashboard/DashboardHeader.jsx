import { Search, Bell } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'

export default function DashboardHeader({
  title,
  subtitle,
  icon,
  searchPlaceholder = '....ابحث',
  children,
}) {
  const { openNotifications } = useNotifications()
  return (
    <header className="bg-white border-b border-[#E2E8F0] px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3.5">
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-[#FB8731]/10 flex items-center justify-center text-[#FB8731] shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-[#011222] tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[#64748B] font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3.5">
        {/* Custom Actions if provided */}
        {children}

        {/* Search Input matching XD Rectangle 77 */}
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-56 lg:w-64 pl-4 pr-10 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#011222] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FB8731] focus:border-transparent transition-all text-right shadow-xs"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Notification Bell matching XD bell (1) */}
        <button
          onClick={openNotifications}
          className="relative w-11 h-11 rounded-xl bg-[#F0F3F8] hover:bg-[#E2E8F0] flex items-center justify-center text-[#011222] transition-colors shrink-0 cursor-pointer"
          title="الإشعارات"
        >
          <Bell className="w-5 h-5 text-[#011222]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FB8731] ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  )
}
