import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Ship, Plane, Truck, FileText, Package, MapPin, ArrowLeft } from 'lucide-react'
import { useServiceModal } from '../../context/ServiceModalContext'

const services = [
  {
    id: 'land',
    title: 'الشحن البري',
    tag: 'مبرد-اكسبريس-TIR',
    description: 'شبكة نقل بري تغطي دول الخليج والمشرق العربي باساطيل حديثة ومؤهلة وسائقين محترفين',
    image: '/images/service-land.png',
    icon: Truck,
  },
  {
    id: 'air',
    title: 'الشحن الجوي',
    tag: 'Cargo-عاجل -اقتصادي',
    description: 'خدمات شحن جوي سريعة و موثوقة لجميع أنواع البضائع مع إمكانية التتبع الفوري و ضمان التسليم',
    image: '/images/service-air.png',
    icon: Plane,
  },
  {
    id: 'sea',
    title: 'الشحن البحري',
    tag: 'FCL-LCL-Reefer',
    description: 'شحن الحاويات الكاملة و الجزيئة و المبردة عبر أكبر الموانئ العالمية بأسعار تنافسية و جداول منتظمة',
    image: '/images/service-sea.png',
    icon: Ship,
  },
  {
    id: 'delivery',
    title: 'التوصيل السريع',
    tag: 'توصيل سريع -امان تام',
    description: 'خدمات توصيل مرنة وسريعة من المستودعات إلى باب العميل النهائي مباشرة، مع إمكانية التتبع المباشر لشحنتك',
    image: '/images/service-delivery.png',
    icon: MapPin,
  },
  {
    id: 'warehouse',
    title: 'التخزين و إدارة المستودعات',
    tag: 'تخزين امان و إدارة المخزون',
    description: 'حلول تخزين متكاملة وامنة و مجهزة باحدث التقنيات لادارة و توزيع البضائع و المخزون بفاعلية عالية',
    image: '/images/service-warehouse.png',
    icon: Package,
  },
  {
    id: 'customs',
    title: 'التخليص  الجمركي و الاستشارات',
    tag: 'استشارات -انهاء اجراءات',
    description: 'انجاز كافة الإجراءات و الوثائق الجمركية بسرعة و كفاءة لضمان عبور بضائعك دون تأخير',
    image: '/images/service-customs.png',
    icon: FileText,
  },
]

export default function ServicesPage() {
  const { openServiceModal } = useServiceModal()

  return (
    <div className="min-h-screen font-almarai bg-[#F0F3F8]" dir="rtl">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-12 text-center">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Badge */}
          <div className="inline-block bg-[#FB8731] text-white font-bold text-base px-8 py-2 rounded-full mb-4 shadow-sm">
            خدماتنا
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-black text-[#011222] mb-3 tracking-tight">
            كل ما تحتاجه في مكان واحد
          </h1>

          {/* Subtitles */}
          <p className="text-[#64748B] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            من الشحن البحري للتخليص الجمركي - نغطي كامل سلسلة التوريد
          </p>
          <p className="text-[#64748B] text-sm md:text-base max-w-2xl mx-auto mt-0.5">
            بشبكة شركاء موثوقة و تقنية متقدمة
          </p>
        </div>
      </section>

      {/* Services Grid matching XD exactly */}
      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.id}
                  onClick={() => openServiceModal(s.id)}
                  className="w-full max-w-[436px] bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 pb-5 group cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="w-full h-[198px] overflow-hidden bg-gray-100 relative">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[#011222] text-xs font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                        <span>عرض تفاصيل الخدمة</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Header Row: Title & Tag with Orange Circle Icon */}
                  <div className="px-6 pt-5 pb-2 flex items-center justify-between gap-4">
                    {/* Title + Tag on right */}
                    <div className="text-right flex-1">
                      <h3 className="text-xl font-bold text-[#011222] leading-tight group-hover:text-[#FB8731] transition-colors">
                        {s.title}
                      </h3>
                      <span className="inline-block bg-[#FB8731] text-white text-[11px] font-bold px-3 py-0.5 rounded-full mt-1.5 shadow-xs">
                        {s.tag}
                      </span>
                    </div>

                    {/* Orange Circle Icon */}
                    <div className="w-12 h-12 rounded-full bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                  </div>

                  {/* Centered Description Text */}
                  <p className="text-[#64748B] text-xs leading-relaxed text-center px-6 mt-3">
                    {s.description}
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
