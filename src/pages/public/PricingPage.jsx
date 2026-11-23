import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Link } from 'react-router-dom'
import { Warehouse, Truck, Plane, Ship, Calculator } from 'lucide-react'

const pricingPlans = [
  {
    id: 'warehouse',
    title: 'التخزين وادارة المستودعات',
    subtitle: 'خدمات التخزين والتوزيع',
    icon: Warehouse,
    price: '$0.30',
    unit: 'لكل كجم',
    startFrom: 'تبدأ من',
  },
  {
    id: 'land',
    title: 'الشحن البري',
    subtitle: 'مثالي للشحنات خارج وداخل المدينة',
    icon: Truck,
    price: '$4.80',
    unit: 'لكل كجم',
    startFrom: 'تبدأ من',
  },
  {
    id: 'air',
    title: 'الشحن الجوي',
    subtitle: 'اسرع حل للشحنات الخفيفة و الثمينة',
    icon: Plane,
    price: '$4.50',
    unit: 'لكل كجم',
    startFrom: 'تبدأ من',
  },
  {
    id: 'sea',
    title: 'الشحن البحري',
    subtitle: 'مثالي للشحنات الكبيرة و ثقيلة الحجم',
    icon: Ship,
    price: '$1.20',
    unit: 'لكل كجم',
    startFrom: 'تبدأ من',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen font-almarai bg-[#F0F3F8]" dir="rtl">
      <Navbar />

      {/* Hero Header with Container Yard Sunset Background matching XD */}
      <section className="relative pt-20 overflow-hidden bg-[#011222]">
        <div className="relative w-full h-[220px] md:h-[260px] lg:h-[280px] overflow-hidden">
          <img
            src="/images/pricing-header.png"
            alt="الأسعار"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle dark gradient overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent pointer-events-none" />

          {/* Right-aligned Title & Subtitle matching XD */}
          <div className="absolute inset-0 max-w-[1500px] mx-auto px-8 md:px-16 flex items-center justify-end">
            <div className="max-w-xl text-right text-white space-y-1.5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                الأسعار
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-white/95 leading-relaxed font-normal drop-shadow-sm">
                أسعار تنافسية تناسب جميع احتياجاتك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pricing Cards Row matching XD exactly */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {pricingPlans.map((plan) => {
              const Icon = plan.icon
              return (
                <div
                  key={plan.id}
                  className="w-full max-w-[340px] bg-white rounded-2xl p-7 text-center shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300 min-h-[380px]"
                >
                  {/* Top Area: Icon, Title, Subtitle */}
                  <div>
                    {/* Circular Icon */}
                    <div className="w-12 h-12 rounded-full bg-[#FFF4EB] border border-[#FB8731]/25 flex items-center justify-center text-[#FB8731] mx-auto mb-3 shadow-xs">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#011222] mb-1">
                      {plan.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[#64748B] text-xs leading-relaxed min-h-[32px] flex items-center justify-center">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price Area */}
                  <div className="my-6">
                    <span className="text-xs text-[#64748B] block mb-1 font-medium">
                      {plan.startFrom}
                    </span>
                    <div className="text-4xl font-black text-[#011222] tracking-tight">
                      {plan.price}
                    </div>
                    <span className="text-xs text-[#64748B] block mt-1">
                      {plan.unit}
                    </span>
                  </div>

                  {/* Orange Action Button */}
                  <Link
                    to="/register"
                    className="inline-block w-full py-3 bg-[#FB8731] hover:bg-[#E06F1B] text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                  >
                    احصل على السعر
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Bottom Dark CTA Banner matching XD */}
          <div className="mt-12 bg-[#071726] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/5">
            {/* Right Side: Icon & Text (RTL start) */}
            <div className="flex items-center gap-4 text-right">
              <div className="w-14 h-14 rounded-2xl bg-[#0D263A] border border-white/10 flex items-center justify-center text-[#FB8731] shrink-0 shadow-xs">
                <Calculator className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  للحصول على عرض سعر مخصص
                </h3>
                <p className="text-white/80 text-xs md:text-sm mt-1">
                  تواصل معنا الأن للحصول على افضل الاسعار
                </p>
              </div>
            </div>

            {/* Left Side: Button */}
            <Link
              to="/contact"
              className="bg-[#FB8731] hover:bg-[#E06F1B] text-white px-9 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-md shrink-0"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
