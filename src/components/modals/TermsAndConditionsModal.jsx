import { useEffect } from 'react'
import { X, ShieldCheck } from 'lucide-react'

export default function TermsAndConditionsModal({ isOpen, onClose }) {
  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-almarai"
      dir="rtl"
    >
      {/* Dimmed Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#011222]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Outer Modal Container with decorative graphics matching XD */}
      <div className="relative z-10 w-full max-w-5xl my-auto animate-scale-up pt-6 sm:pt-8">
        {/* Close Button Inside the Top-Left Orange Circle */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 -left-4 sm:top-1 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FB8731] hover:bg-[#E06F1B] text-white flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer z-30 group"
          title="إغلاق النافذة"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] text-white group-hover:rotate-90 transition-transform duration-300 drop-shadow-sm" />
        </button>

        {/* Decorative Bottom-Left Orange Dots (matching XD) */}
        <div className="absolute -bottom-7 left-8 flex items-center gap-1.5 pointer-events-none -z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB8731]" />
        </div>

        {/* Decorative Bottom-Right Modern Orange Wave (matching XD) */}
        <div className="absolute -bottom-8 -right-8 w-48 h-40 bg-gradient-to-tl from-[#FB8731] via-[#FB8731]/70 to-transparent rounded-tl-[100px] pointer-events-none -z-10 opacity-90" />

        {/* Main Title Above Box */}
        <div className="text-right mb-4 pr-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            الشروط و الأحكام
          </h2>
        </div>

        {/* Main Cards Area (matching XD screenshot layout) */}
        <div className="space-y-4">
          
          {/* Top 3-Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column 1 (Far Right in RTL): مقدمة + مسؤوليات المستخدم */}
            <div className="flex flex-col gap-4">
              {/* Card 1: مقدمة */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/90 text-right flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black text-[#011222] mb-2.5">مقدمة</h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-semibold">
                  مرحباً بكم في منصة ميناء، توضح هذه الشروط والأحكام الشروط التي تحكم استخدامك لخدماتنا وموقعنا، باستمرار استخدامك فإنك توافق على الالتزام بها.
                </p>
              </div>

              {/* Card 2: مسؤوليات المستخدم */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/90 text-right flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black text-[#011222] mb-3">مسؤوليات المستخدم</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#475569]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                    <span>
                      <strong className="text-[#011222]">دقة المعلومات:</strong> الالتزام بتقديم معلومات صحيحة.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                    <span>
                      <strong className="text-[#011222]">السلوك المحظور:</strong> منع استخدام المنصة لغايات غير قانونية.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2 (Center in RTL): شروط الخدمة العامة (Large Vertical Card) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/90 text-right flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#011222] mb-4 text-center">
                  شروط الخدمة العامة
                </h3>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#475569]">
                  {/* Point 1 */}
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                    <div>
                      <strong className="text-[#FB8731]">أهلية المستخدم:</strong>{' '}
                      <span>يجب أن يكون المستخدم بالغاً السن القانونية لاستخدام المنصة وتحمل المسؤولية الكاملة عن كافة الخدمات والاشتراكات.</span>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                    <div>
                      <strong className="text-[#FB8731]">الوصول إلى الحساب:</strong>{' '}
                      <span>أنت مسؤول مسؤولية كاملة عن الحفاظ على سرية بيانات حسابك وكلمة المرور، وعن أي نشاط يتم من خلاله.</span>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#FB8731] text-base leading-none mt-0.5">•</span>
                    <div>
                      <strong className="text-[#FB8731]">رسوم الاشتراك:</strong>{' '}
                      <span>توضيح كامل لسياسة المدفوعات، رسوم الاشتراكات الشهرية أو السنوية، وطرق الفوترة المعتمدة في المنصة.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 (Far Left in RTL): شروط المستخدم + لوائح الشحن */}
            <div className="flex flex-col gap-4">
              {/* Card 1: شروط المستخدم */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/90 text-right flex-1 flex flex-col justify-center">
                <div className="mb-2">
                  <span className="inline-block bg-[#FB8731] text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-xs">
                    شروط المستخدم
                  </span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-[#475569] leading-relaxed">
                  <p>
                    <strong className="text-[#011222]">دقة البيانات:</strong> التزام المستخدم بتقديم معلومات صحيحة ودقيقة عند التسجيل أو إضافة الشحنات.
                  </p>
                  <p>
                    <strong className="text-[#011222]">السلوك المحظور:</strong> يُحظر تماماً استخدام المنصة أو أي من خدماتها لأغراض غير قانونية أو مخالفة للأنظمة.
                  </p>
                </div>
              </div>

              {/* Card 2: لوائح الشحن */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/90 text-right flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black text-[#011222] mb-2.5">لوائح الشحن</h3>
                <div className="space-y-2 text-xs sm:text-sm text-[#475569] leading-relaxed">
                  <p>
                    <strong className="text-[#011222]">المواد المحظورة:</strong> قائمة بالسلع والمنتجات التي يُمنع شحنها عبر المنصة وفقاً للأنظمة واللوائح المحلية والدولية.
                  </p>
                  <p>
                    <strong className="text-[#011222]">التعبئة والتغليف:</strong> معايير واشتراطات تغليف الشحنات لضمان سلامتها وأمانها أثناء عملية النقل.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: 2 Wide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bottom Card 1 (Right in RTL): حدود المسؤولية */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/90 text-right">
              <h3 className="text-lg font-black text-[#011222] mb-2">حدود المسؤولية</h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-semibold">
                إخلاء مسؤولية ميناء لوجستيكس عن أي خسائر غير مباشرة أو طارئة قد تنتج عن عمليات النقل والشحن.
              </p>
            </div>

            {/* Bottom Card 2 (Left in RTL): شروط الدفع و الأسعار */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/90 text-right">
              <h3 className="text-lg font-black text-[#011222] mb-2">شروط الدفع و الأسعار</h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-semibold">
                توضيح كامل لوسائل الدفع المعتمدة، آلية إصدار الفواتير، وسياسات الاسترداد المالي في المنصة.
              </p>
            </div>
          </div>

          {/* Bottom Pill Bar under the box matching XD */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl px-6 py-3.5 flex items-center justify-between text-xs font-bold shadow-lg">
            {/* Active Tab: الشروط والاحكام */}
            <div className="flex items-center gap-2">
              <span className="text-[#011222] font-bold text-xs sm:text-sm border-b-2 border-[#FB8731] pb-0.5">
                الشروط والاحكام
              </span>
            </div>

            {/* Left Brand Badge */}
            <div className="flex items-center gap-2.5" dir="ltr">
              <span className="text-gray-500 font-bold text-xs sm:text-sm">
                Meyna Logistics 2026
              </span>
              <div className="w-6 h-6 rounded-lg bg-[#FB8731] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
