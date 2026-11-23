import { Ship } from 'lucide-react'
import { useLegalModal } from '../../context/LegalModalContext'

export default function DashboardFooterBar() {
  const { openLegalModal } = useLegalModal()

  return (
    <footer
      className="bg-white rounded-2xl px-8 py-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#64748B] relative z-10 transition-all duration-500 hover:shadow-md animate-subtle-float"
      style={{
        animation: 'meynaSubtleFloat 4s ease-in-out infinite'
      }}
    >
      <style>{`
        @keyframes meynaSubtleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes meynaShipRock {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        .meyna-ship-icon {
          animation: meynaShipRock 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Right in RTL (first in DOM): Navigation Links matching Adobe XD */}
      <div className="flex items-center gap-6 text-[#64748B] flex-wrap justify-center">
        <button
          type="button"
          onClick={() => openLegalModal('contact')}
          className="hover:text-[#FB8731] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs font-bold text-[#64748B]"
        >
          اتصل بنا
        </button>
        <button
          type="button"
          onClick={() => openLegalModal('help')}
          className="hover:text-[#FB8731] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs font-bold text-[#64748B]"
        >
          مركز المساعدة
        </button>
        <button
          type="button"
          onClick={() => openLegalModal('terms')}
          className="hover:text-[#FB8731] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs font-bold text-[#64748B]"
        >
          الشروط والاحكام
        </button>
        <button
          type="button"
          onClick={() => openLegalModal('privacy')}
          className="hover:text-[#FB8731] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs font-bold text-[#64748B]"
        >
          سياسة الخصوصية
        </button>
      </div>

      {/* Left in RTL (second in DOM): Meyna Logistics + 2026 + Orange Ship Square */}
      <div className="flex items-center gap-3">
        <span className="text-[#011222] font-black text-sm tracking-tight font-sans">
          Meyna Logistics
        </span>
        <span className="font-mono text-gray-400 text-xs">2026</span>
        <div className="w-8 h-8 rounded-lg bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-500/20">
          <Ship className="w-4 h-4 meyna-ship-icon" />
        </div>
      </div>
    </footer>
  )
}
