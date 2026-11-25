import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import {
  Star,
  Search,
  Bell
} from 'lucide-react'

const starBreakdown = [
  { star: 5, percentage: 78, barColor: '#FB8731', width: '78%' },
  { star: 4, percentage: 16, barColor: '#FB8731', width: '16%' },
  { star: 3, percentage: 4, barColor: '#95A1B8', width: '4%' },
  { star: 2, percentage: 1, barColor: '#95A1B8', width: '1.5%' },
  { star: 1, percentage: 1, barColor: '#95A1B8', width: '1.5%' },
]

const reviews = [
  {
    id: 1,
    author: 'مجموعة الريادة للمقاولات',
    initial: 'م',
    rating: 5,
    shipment: 'SHN:2026:718',
    date: '2026-8-20',
    comment: 'خدمة ممتازة وسرعة في التنفيذ, سنتعامل معكم مجدداً بكل تأكيد',
  },
  {
    id: 2,
    author: 'شركة النخبة للأغذية',
    initial: 'ش',
    rating: 5,
    shipment: 'SHN:2026:698',
    date: '2026-8-18',
    comment: 'احترافبة عالية في التعامل مع البضائع المبردة ,الحمولة وصلت سليمة ',
  },
]

export default function ReviewsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoProvider = !currentUser || currentUser.email === 'provider@meynaa.com'

  const [searchTerm, setSearchTerm] = useState('')

  const activeReviews = isDemoProvider ? reviews : []

  const filtered = activeReviews.filter((r) =>
    r.author.includes(searchTerm) ||
    r.comment.includes(searchTerm) ||
    r.shipment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner (Rectangle 70 in XD) */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-10"
        aria-hidden="true"
      ></div>

      {/* Decorative Orange Blob at Bottom-Right Corner (Rectangle 69 in XD) */}
      <div
        className="absolute -bottom-16 right-72 w-56 h-56 rounded-full bg-[#FB8731]/80 pointer-events-none z-0 hidden lg:block"
        aria-hidden="true"
      ></div>

      {/* Sidebar matching XD */}
      <Sidebar activePath="/dashboard/reviews" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top White Header Bar - Rectangle 176 in XD */}
        <header className="bg-white rounded-2xl px-8 py-5 shadow-xs border border-gray-100 flex items-center justify-between">
          {/* Right: Title & Subtitle + Orange Star Icon Box */}
          <div className="flex items-center gap-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#011222] tracking-tight">التقييمات</h1>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">آراء العملاء ومستوى رضاهم</p>
            </div>
          </div>

          {/* Left: Search input + Notification bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="....ابحث"
                className="w-52 pl-4 pr-9 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={openNotifications}
              title="الإشعارات"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#64748B] hover:text-[#011222] hover:bg-gray-50 transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FB8731] absolute top-2 right-2 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Top Rating Breakdown Section (Two Cards: Rectangle 159 & Rectangle 158) */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Large Card: Star Breakdown Bars (Rectangle 159 in XD - Span 3) */}
          <div className="lg:col-span-3 bg-white rounded-[25px] p-8 shadow-xs border border-gray-100 flex flex-col justify-center">
            <div className="space-y-4">
              {starBreakdown.map((item) => (
                <div key={item.star} className="flex items-center justify-between gap-4 text-xs font-bold">
                  {/* Left: Percentage */}
                  <span className="w-10 text-right text-[#64748B] font-mono text-xs">
                    {item.percentage}%
                  </span>

                  {/* Center: Progress Bar Track with colored bar starting from Right */}
                  <div className="flex-1 h-3.5 bg-[#E1E8F0] rounded-full overflow-hidden flex justify-start">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: item.width,
                        backgroundColor: item.barColor,
                      }}
                    ></div>
                  </div>

                  {/* Right: Star Number + Star Icon */}
                  <div className="flex items-center gap-1.5 w-10 justify-end text-[#011222]">
                    <span className="text-sm font-bold">{item.star}</span>
                    <Star className="w-3.5 h-3.5 fill-current text-[#FB8731]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Small Card: 4.9 Score Card (Rectangle 158 in XD - Span 1) */}
          <div className="bg-white rounded-[25px] p-8 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Top-left decorative orange corner */}
            <div
              className="absolute -top-6 -left-6 w-14 h-14 bg-[#FB8731] rotate-45 pointer-events-none"
              aria-hidden="true"
            ></div>

            {/* Bottom-right decorative orange corner */}
            <div
              className="absolute -bottom-6 -right-6 w-14 h-14 bg-[#FB8731] rotate-45 pointer-events-none"
              aria-hidden="true"
            ></div>

            {/* Score Content */}
            <span className="text-6xl font-black text-[#011222] tracking-tight leading-none mb-3">
              {isDemoProvider ? '4.9' : '5.0'}
            </span>

            {/* 5 Orange Stars */}
            <div className="flex items-center gap-1 my-2 text-[#FB8731]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            <span className="text-xs font-bold text-[#777777] mt-1">
              {isDemoProvider ? 'من اصل 124 تقييم' : 'حساب جديد معتمد'}
            </span>
          </div>
        </section>

        {/* Bottom All Reviews Container (Rectangle 160 in XD) */}
        <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-8">
          {/* Section Header */}
          <div className="border-b border-gray-100 pb-4 text-right">
            <h2 className="text-lg font-black text-[#011222]">جميع التقييمات</h2>
          </div>

          {/* Reviews List */}
          <div className="space-y-8">
            {filtered.map((item) => (
              <div key={item.id} className="space-y-3 text-right">
                {/* Author Info Row */}
                <div className="flex items-center justify-between">
                  {/* Left: Date */}
                  <span className="text-xs font-mono text-[#777777]">
                    {item.date}
                  </span>

                  {/* Right: Avatar + Author + Shipment & Rating */}
                  <div className="flex items-center gap-3">
                    <div className="space-y-0.5 text-right">
                      <h3 className="text-sm font-black text-[#011222]">
                        {item.author}
                      </h3>
                      <div className="flex items-center justify-end gap-2 text-xs text-[#777777]">
                        <div className="flex items-center gap-1 text-[#FB8731]">
                          <span className="font-bold">{item.rating}</span>
                          <div className="flex items-center">
                            {[...Array(item.rating)].map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="font-mono text-[#64748B]">شحنة: {item.shipment}</span>
                      </div>
                    </div>

                    {/* Circular Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#011222] font-black text-sm shrink-0">
                      {item.initial}
                    </div>
                  </div>
                </div>

                {/* Quote Box - Rectangle 172 & 173 in XD (#E1E8F0) */}
                <div className="p-4 rounded-xl bg-[#E1E8F0] text-[#011222] text-xs font-medium leading-relaxed text-right">
                  "{item.comment}"
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FB8731] flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <p className="text-sm font-bold text-[#011222]">لا توجد تقييمات مسجلة بعد</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  ستظهر هنا آراء وتقييمات المستوردين فور إتمام أول شحنة وتسليمها بنجاح.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Floating Moving Footer Bar */}
        <DashboardFooterBar />

        {/* Bottom 4 Orange Dots on Left */}
        <div className="w-full pt-3 clearfix" style={{ direction: 'ltr', textAlign: 'left' }} aria-hidden="true">
          <div className="flex items-center gap-2" style={{ float: 'left', direction: 'ltr' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
          </div>
        </div>
      </main>
    </div>
  )
}
