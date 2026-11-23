import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, X, Link2, Globe, Share2 } from 'lucide-react'
import { useServiceModal } from '../../context/ServiceModalContext'
import { useLegalModal } from '../../context/LegalModalContext'

export default function Footer() {
  const { openServiceModal } = useServiceModal()
  const { openLegalModal } = useLegalModal()
  return (
    <footer className="bg-[#011222] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/meynaa-logo.png"
                alt="MEYNAA ميناء"
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="text-white font-extrabold text-xl tracking-wider block leading-none">MEYNAA</span>
                <span className="text-[#FB8731] text-xs font-bold tracking-widest block mt-0.5">ميناء للوجستيات</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              منصة اللوجستيات الرقمية الأولى في المنطقة العربية. نربطك بأفضل مزودي خدمات الشحن البحري والجوي والبري.
            </p>
            <div className="flex gap-2.5">
              {[X, Link2, Globe, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/5 hover:bg-[#FB8731] border border-white/10 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-5 text-[#FB8731]">روابط سريعة</h3>
            <ul className="space-y-3">
              {[
                { label: 'الرئيسية', path: '/' },
                { label: 'خدماتنا', path: '/services' },
                { label: 'لماذا ميناء؟', path: '/why-meynaa' },
                { label: 'الأسعار', path: '/pricing' },
                { label: 'تواصل معنا', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white text-sm transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-bold text-base mb-5 text-[#FB8731]">خدماتنا</h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => openServiceModal('sea')}
                  className="hover:text-[#FB8731] transition-colors block text-right cursor-pointer"
                >
                  الشحن البحري (FCL / LCL)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openServiceModal('air')}
                  className="hover:text-[#FB8731] transition-colors block text-right cursor-pointer"
                >
                  الشحن الجوي السريع
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openServiceModal('land')}
                  className="hover:text-[#FB8731] transition-colors block text-right font-bold text-white cursor-pointer"
                >
                  النقل والشحن البري
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openServiceModal('customs')}
                  className="hover:text-[#FB8731] transition-colors block text-right cursor-pointer"
                >
                  التخليص الجمركي والاستشارات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openServiceModal('warehouse')}
                  className="hover:text-[#FB8731] transition-colors block text-right cursor-pointer"
                >
                  التخزين وإدارة المستودعات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openServiceModal('delivery')}
                  className="hover:text-[#FB8731] transition-colors block text-right cursor-pointer"
                >
                  التوصيل السريع للميل الأخير
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-base mb-5 text-[#FB8731]">تواصل معنا</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FB8731] mt-1 shrink-0" />
                <p className="text-white/70 text-sm">دبي_الإمارات العربية المتحدة</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FB8731] shrink-0" />
                <a href="tel:+566501234567" className="text-white/70 text-sm hover:text-white transition-colors" dir="ltr">
                  +566 50 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FB8731] shrink-0" />
                <a href="mailto:info@mina.com" className="text-white/70 text-sm hover:text-white transition-colors">
                  info@mina.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 MEYNAA - ميناء للوجستيات الرقمية. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => openLegalModal('privacy')}
              className="hover:text-[#FB8731] cursor-pointer transition-colors bg-transparent border-none p-0 text-xs text-white/50"
            >
              سياسة الخصوصية
            </button>
            <button
              type="button"
              onClick={() => openLegalModal('terms')}
              className="hover:text-[#FB8731] cursor-pointer transition-colors bg-transparent border-none p-0 text-xs text-white/50"
            >
              الشروط والأحكام
            </button>
            <button
              type="button"
              onClick={() => openLegalModal('help')}
              className="hover:text-[#FB8731] cursor-pointer transition-colors bg-transparent border-none p-0 text-xs text-white/50"
            >
              مركز المساعدة
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
