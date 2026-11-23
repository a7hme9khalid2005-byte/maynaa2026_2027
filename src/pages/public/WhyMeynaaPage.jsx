import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Globe, Gauge, ShieldCheck, HeartHandshake, Tag, Users } from 'lucide-react'

const pillars = [
  {
    icon: Globe,
    title: 'شبكة عالمية',
    desc: 'نمتلك علاقات مع أبرز شركات النقل حول العالم',
  },
  {
    icon: Gauge,
    title: 'سرعة في الإنجاز',
    desc: 'نلتزم في المواعيد لضمن وصول شحنتك في الوقت المحدد',
  },
  {
    icon: ShieldCheck,
    title: 'أمان و موثوقية',
    desc: 'نضمن لك سلامة بضائعك في كل مراحل الشحن',
  },
  {
    icon: HeartHandshake,
    title: 'دعم مستمر',
    desc: 'فريقنا معك في كل خطوة من البداية حتى الوصول',
  },
  {
    icon: Tag,
    title: 'أسعار تنافسية',
    desc: 'نقدم لك افضل الأسعار مع جودة عالية للخدمة',
  },
  {
    icon: Users,
    title: 'فريق متخصص',
    desc: 'فريقنا يضمن لك افضل حلول للشحن والتخليص',
  },
]

export default function WhyMeynaaPage() {
  return (
    <div className="min-h-screen font-almarai bg-[#F0F3F8]" dir="rtl">
      <Navbar />

      {/* Hero Banner with Airplane Takeoff image matching XD */}
      <section className="relative pt-20 overflow-hidden bg-[#011222]">
        <div className="relative w-full h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <img
            src="/images/why-takeoff.png"
            alt="لماذا ميناء؟"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient on the left side to make white text pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none" />

          {/* Text positioned on the left side of the sky matching XD */}
          <div className="absolute inset-0 max-w-[1500px] mx-auto px-8 md:px-16 flex items-center justify-start">
            <div className="max-w-md text-right text-white space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                لماذا ميناء؟
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-white/95 leading-relaxed font-normal drop-shadow-sm">
                لان نؤمن بأن نجاح عملك يبدأ من وصول منتجاتك بأمان و في الوقت المحدد
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Pillars Grid matching XD screenshot exactly */}
      <section className="py-16 md:py-20 bg-[#F0F3F8]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="w-full max-w-[420px] bg-white rounded-2xl p-8 md:p-10 text-center shadow-xs border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300 min-h-[230px]"
                >
                  {/* Solid Orange Circular Icon */}
                  <div className="w-16 h-16 rounded-full bg-[#FB8731] flex items-center justify-center text-white mb-5 shadow-sm shrink-0">
                    <Icon className="w-8 h-8 stroke-[1.8]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-[#011222] mb-2.5">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#64748B] text-xs md:text-sm leading-relaxed max-w-[260px] mx-auto">
                    {pillar.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
