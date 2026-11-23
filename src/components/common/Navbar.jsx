import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { label: 'الرئيسية', path: '/' },
  { label: 'خدماتنا', path: '/services' },
  { label: 'لماذا ميناء؟', path: '/why-meynaa' },
  { label: 'الأسعار', path: '/pricing' },
  { label: 'تواصل معنا', path: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 font-almarai ${
        isHome
          ? 'absolute top-0 left-0 right-0 bg-transparent py-5 px-8 md:px-14'
          : 'fixed top-0 left-0 right-0 bg-[#011222] shadow-md border-b border-white/5 py-4 px-6 md:px-12'
      }`}
      dir="rtl"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Right Side: Logo + Nav Links together */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo matching XD */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/images/meynaa-logo.png"
              alt="MEYNAA ميناء"
              className="h-11 w-auto object-contain"
            />
            <div className="text-right">
              <span className="text-white font-extrabold text-2xl tracking-wider block leading-none font-sans">
                MEYNAA
              </span>
              <span className="text-[#FB8731] text-xs font-bold tracking-widest block mt-0.5">
                ميناء
              </span>
            </div>
          </Link>

          {/* Navigation Links directly next to logo */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm md:text-base font-semibold transition-all relative py-1.5 ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#FB8731] rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Left Side: Auth Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="bg-[#2A3947]/80 hover:bg-[#2A3947] text-white rounded-full px-5 py-2.5 text-xs md:text-sm font-bold transition-all border border-white/10 backdrop-blur-xs"
          >
            تسجيل دخول
          </Link>
          <Link
            to="/register"
            className="bg-[#FB8731] hover:bg-[#E06F1B] text-white rounded-full px-6 py-2.5 text-xs md:text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            ابدأ مجاناً
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#011222]/98 backdrop-blur-md border-b border-white/10 px-6 py-5 mt-4 rounded-2xl space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block text-white/90 text-sm font-semibold hover:text-[#FB8731] py-1.5"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="text-center text-white border border-white/20 rounded-full py-2.5 text-sm font-bold bg-[#2A3947]"
            >
              تسجيل دخول
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="text-center bg-[#FB8731] text-white rounded-full py-2.5 text-sm font-bold"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
