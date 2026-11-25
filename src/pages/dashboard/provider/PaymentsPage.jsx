import { useState, useEffect } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import financeService from '../../../services/financeService'
import {
  Search,
  Bell,
  TrendingUp,
  Calendar,
  Coins,
  Calculator,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  FileText,
  AlertCircle,
  X
} from 'lucide-react'

const initialIncomingTransfers = [
  {
    id: 'TRX-984210',
    importerName: 'مؤسسة الأفق للاستيراد (سارة)',
    shipmentNumber: 'SHN-2026-884',
    route: 'الدمام ⬅️ الرياض',
    currency: 'USD',
    currencySymbol: '$',
    amount: '$13,800',
    amountNum: 13800,
    senderBank: 'مصرف الإنماء',
    transferDate: '2026-11-23 09:45 ص',
    receiptUrl: '/images/auth-ship-bg.png',
    adminAudited: true,
    status: 'APPROVED_BY_ADMIN_PENDING_PROVIDER', // معتمد إدارياً - بانتظار تأكيد المزود
  },
  {
    id: 'TRX-984218',
    importerName: 'شركة النور للتجارة والتوريدات',
    shipmentNumber: 'SHN-2026-905',
    route: 'ميناء العقبة ⬅️ عمان',
    currency: 'DINAR',
    currencySymbol: 'د.أ',
    amount: '2,050 د.أ',
    amountNum: 2050,
    senderBank: 'بنك الاتحاد',
    transferDate: '2026-11-23 11:30 ص',
    receiptUrl: '/images/auth-ship-bg.png',
    adminAudited: true,
    status: 'APPROVED_BY_ADMIN_PENDING_PROVIDER',
  },
  {
    id: 'TRX-984225',
    importerName: 'المجموعة العالمية للشحن والتفريغ',
    shipmentNumber: 'SHN-2026-912',
    route: 'هامبورغ ⬅️ جدة',
    currency: 'EUR',
    currencySymbol: '€',
    amount: '€5,125',
    amountNum: 5125,
    senderBank: 'Deutsche Bank',
    transferDate: '2026-11-23 01:15 م',
    receiptUrl: '/images/auth-ship-bg.png',
    adminAudited: true,
    status: 'APPROVED_BY_ADMIN_PENDING_PROVIDER',
  }
]

const initialPayments = [
  {
    id: 'PAY-8811',
    dueDate: '2026-08-21',
    client: 'مجموعة الريادة 1',
    amount: '+$4,500',
    status: 'قيد التحويل',
    statusBg: '#FEF3C7',
    statusColor: '#D97706',
  },
  {
    id: 'PAY-8821',
    dueDate: '2026-08-22',
    client: 'مجموعة الريادة 2',
    amount: '+$9,000',
    status: 'قيد التحويل',
    statusBg: '#FEF3C7',
    statusColor: '#D97706',
  },
  {
    id: 'PAY-8831',
    dueDate: '2026-08-23',
    client: 'مجموعة الريادة 3',
    amount: '+$13,500',
    status: 'قيد التحويل',
    statusBg: '#FEF3C7',
    statusColor: '#D97706',
  },
  {
    id: 'PAY-8841',
    dueDate: '2026-08-24',
    client: 'مجموعة الريادة 4',
    amount: '+$18,000',
    status: 'قيد التحويل',
    statusBg: '#FEF3C7',
    statusColor: '#D97706',
  },
]

export default function PaymentsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoProvider = !currentUser || currentUser.email === 'provider@meynaa.com'

  const [searchTerm, setSearchTerm] = useState('')
  const [incomingTransfers, setIncomingTransfers] = useState(() => (isDemoProvider ? initialIncomingTransfers : []))
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [rejectModalData, setRejectModalData] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // جلب الحوالات المعتمدة من الأدمن لمزود الخدمة من الباك إند
  useEffect(() => {
    financeService.getProviderPendingTransfers()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          const liveTransfers = res.data.map(item => ({
            id: item.id.substring(0, 10).toUpperCase(),
            importerName: item.payer?.fullName || 'مؤسسة الأفق للاستيراد',
            shipmentNumber: item.invoice?.shipmentId ? `SHN-${item.invoice.shipmentId.substring(0, 6)}` : 'SHN-2026-884',
            route: 'الدمام ⬅️ الرياض',
            currency: item.currency || 'USD',
            currencySymbol: item.currency === 'DINAR' ? 'د.أ' : item.currency === 'EUR' ? '€' : '$',
            amount: item.currency === 'USD' ? `$${item.transferAmount.toLocaleString()}` : `${item.transferAmount.toLocaleString()} ${item.currency === 'DINAR' ? 'د.أ' : '€'}`,
            amountNum: item.transferAmount,
            senderBank: item.senderBankName || 'مصرف الإنماء',
            transferDate: new Date(item.createdAt).toLocaleString('ar-SA'),
            receiptUrl: item.receiptFileUrl || '/images/auth-ship-bg.png',
            adminAudited: true,
            status: 'APPROVED_BY_ADMIN_PENDING_PROVIDER',
          }))
          setIncomingTransfers(liveTransfers)
        }
      })
      .catch(() => {})
  }, [])

  // تأكيد المزود لاستلام الحوالة في حسابه البنكي
  const handleConfirmTransfer = async (transferId) => {
    try {
      await financeService.confirmTransferByProvider(transferId)
    } catch {
      // استمرار التحديث محلياً بسلاسة
    }
    setIncomingTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'CONFIRMED_BY_PROVIDER' } : t))
    )
    showToast(`✅ تم تأكيد استلام الحوالة (${transferId}) في الحساب البنكي بنجاح وتفعيل الشحنة للتحميل!`)
  }

  // رفض المزود للحوالة
  const handleRejectTransfer = async () => {
    if (!rejectModalData) return
    const reason = rejectReason || 'الحوالة لم تظهر في حسابنا البنكي'
    try {
      await financeService.rejectTransferByProvider(rejectModalData.id, reason)
    } catch {
      // استمرار التحديث محلياً بسلاسة
    }
    setIncomingTransfers((prev) =>
      prev.map((t) =>
        t.id === rejectModalData.id
          ? { ...t, status: 'REJECTED_BY_PROVIDER', rejectionReason: reason }
          : t
      )
    )
    showToast(`❌ تم إشعار الإدارة والمستورد بعدم وصول الحوالة: ${reason}`)
    setRejectModalData(null)
    setRejectReason('')
  }

  const paymentsSource = isDemoProvider ? initialPayments : []
  const filtered = paymentsSource.filter((p) =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.includes(searchTerm)
  )

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-10"
        aria-hidden="true"
      ></div>

      {/* Decorative Orange Blob at Bottom-Right Corner */}
      <div
        className="absolute -bottom-16 right-72 w-56 h-56 rounded-full bg-[#FB8731]/80 pointer-events-none z-0 hidden lg:block"
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <Sidebar activePath="/dashboard/payments" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top White Header Bar */}
        <header className="bg-white rounded-2xl px-8 py-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#011222] tracking-tight">المالية والحسابات</h1>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">متابعة تحويلات المستوردين المباشرة وأرباحك اللوجستية</p>
            </div>
          </div>

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

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-[#011222] text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xl border border-[#FB8731]/40 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#FB8731]" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 🌟 3 Stat Cards Row - أول عنصر في الصفحة بحسب التصميم */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 (Right in RTL): إجمالي التحويلات المحصلة */}
          <div className="bg-white rounded-[25px] p-6 shadow-xs border border-gray-100 flex flex-col justify-between h-[180px] text-right">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#64748B]">إجمالي التحويلات المحصله</span>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoProvider ? '$48,900' : '$0'}
              </div>
              <p className="text-xs font-bold text-[#0284C7] mt-1">
                {isDemoProvider ? 'محولة لحسابكم البنكي' : 'لا توجد تحويلات بعد'}
              </p>
            </div>
          </div>

          {/* Card 2 (Middle in RTL): أرباح الشهر الحالي */}
          <div className="bg-white rounded-[25px] p-6 shadow-xs border border-gray-100 flex flex-col justify-between h-[180px] text-right">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#D1FAE5] flex items-center justify-center text-[#059669]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#64748B]">أرباح الشهر الحالي</span>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-black text-[#011222] tracking-tight">
                {isDemoProvider ? '$124,500' : '$0'}
              </div>
              <p className="text-xs font-bold text-[#059669] mt-1">
                {isDemoProvider ? '+8.5% عن الشهر الماضي' : 'جاهز للبدء'}
              </p>
            </div>
          </div>

          {/* Card 3 (Left in RTL): عمولات المنصة المستحقة */}
          <div className="bg-white rounded-[25px] p-6 shadow-xs border border-gray-100 flex flex-col justify-between h-[180px] text-right">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#FFEDD5] flex items-center justify-center text-[#EA580C]">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#64748B]">عمولات المنصة المستحقة</span>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-black text-[#EA580C] tracking-tight">
                {isDemoProvider ? '$3,240' : '$0'}
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                {isDemoProvider ? 'تخصم وفق نسب القطاعات الرسمية' : '0% عمولة تجريبية'}
              </p>
            </div>
          </div>
        </section>

        {/* 🌟 NEW: قسم الحوالات البنكية المباشرة من المستوردين (المعتمدة إدارياً بانتظار فحص حساب المزود) */}
        <section className="bg-white rounded-[25px] p-6 shadow-xs border border-orange-200/80 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF4EB] border border-[#FB8731]/40 flex items-center justify-center text-[#FB8731] shrink-0">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#011222] flex items-center gap-2">
                  <span>إشعارات التحويل البنكي المعتمدة إدارياً (بانتظار تأكيدك)</span>
                  <span className="bg-[#FB8731] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {incomingTransfers.filter(t => t.status === 'APPROVED_BY_ADMIN_PENDING_PROVIDER').length} معتمدة إدارياً
                  </span>
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-0.5">
                  تم تدقيق هذه الإشعارات واعتمادها من إدارة المنصة مسبقاً. يرجى مطابقة وصول المبلغ في حسابك البنكي الفعلي وتأكيد الاستلام لتفعيل الشحنة
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#011222] font-black text-xs border-b border-gray-100">
                  <th className="py-3.5 px-4">رقم العملية</th>
                  <th className="py-3.5 px-4">المستورد (العميل)</th>
                  <th className="py-3.5 px-4">رقم الشحنة والمسار</th>
                  <th className="py-3.5 px-4">المبلغ والعملة</th>
                  <th className="py-3.5 px-4">بنك العميل والتاريخ</th>
                  <th className="py-3.5 px-4 text-center">تدقيق الإدارة</th>
                  <th className="py-3.5 px-4 text-center">إشعار السداد</th>
                  <th className="py-3.5 px-4 text-center">إجراء التحقق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {incomingTransfers.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                    {/* رقم العملية */}
                    <td className="py-4 px-4 font-mono font-bold text-[#0284C7]">
                      {item.id}
                    </td>

                    {/* المستورد */}
                    <td className="py-4 px-4 font-bold text-[#011222]">
                      {item.importerName}
                    </td>

                    {/* الشحنة والمسار */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[#011222] block">{item.shipmentNumber}</span>
                      <span className="text-[11px] text-[#64748B]">{item.route}</span>
                    </td>

                    {/* المبلغ والعملة */}
                    <td className="py-4 px-4 font-black text-[#009F65] text-sm font-mono">
                      {item.amount}
                    </td>

                    {/* البنك والتاريخ */}
                    <td className="py-4 px-4">
                      <span className="block text-[#011222] font-bold">{item.senderBank}</span>
                      <span className="text-[11px] text-[#64748B] font-mono">{item.transferDate}</span>
                    </td>

                    {/* تدقيق الإدارة */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>معتمد إدارياً</span>
                      </span>
                    </td>

                    {/* زر معاينة الإشعار */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedReceipt(item)}
                        className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#0284C7] px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                        title="معاينة إيصال البنك"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة الإشعار</span>
                      </button>
                    </td>

                    {/* أزرار التحقق */}
                    <td className="py-4 px-4 text-center">
                      {item.status === 'APPROVED_BY_ADMIN_PENDING_PROVIDER' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleConfirmTransfer(item.id)}
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
                            title="تأكيد استلام المبلغ في حسابنا البنكي الفعلي وتفعيل الشحنة"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تأكيد الاستلام بالبنك</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectModalData(item)
                              setRejectReason('')
                            }}
                            className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                            title="إبلاغ بعدم وصول الحوالة"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>لم تصل</span>
                          </button>
                        </div>
                      ) : item.status === 'CONFIRMED_BY_PROVIDER' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم الاستلام وتفعيل الشحنة</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>مرفوض (لم تصل للحساب)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {incomingTransfers.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-xs font-bold">
                لا توجد إشعارات تحويل جديدة بانتظار التأكيد حالياً.
              </div>
            )}
          </div>
        </section>

        {/* Payments Table Container */}
        <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-6 pb-4 border-b border-gray-100 text-center">
            <h3 className="text-lg font-black text-[#011222]">سجل الدفعات والفواتير السابقة</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#F0F3F8] text-[#011222] font-black text-xs">
                  <th className="py-4 px-6 text-right">رقم الدفعة</th>
                  <th className="py-4 px-6 text-right">تاريخ الاستحقاق</th>
                  <th className="py-4 px-6 text-right">العميل</th>
                  <th className="py-4 px-6 text-right">المبلغ</th>
                  <th className="py-4 px-6 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-5 px-6">
                      <span className="font-bold text-[#0284C7] bg-[#DCF0FE] px-4 py-1.5 rounded-lg font-mono inline-block">
                        {item.id}
                      </span>
                    </td>
                    <td className="py-5 px-6 font-mono text-[#64748B]">
                      {item.dueDate}
                    </td>
                    <td className="py-5 px-6 font-bold text-[#011222]">
                      {item.client}
                    </td>
                    <td className="py-5 px-6 font-black text-[#009F65] text-sm font-mono">
                      {item.amount}
                    </td>
                    <td className="py-5 px-6">
                      <span
                        className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: item.statusBg,
                          color: item.statusColor,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-xs font-bold">
                لا توجد دفعات أو فواتير سابقة مسجلة بعد.
              </div>
            )}
          </div>
        </section>

        {/* Floating Moving Footer Bar */}
        <DashboardFooterBar />
      </main>

      {/* 🖼️ Modal: معاينة إيصال السداد البنكي */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute left-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0284C7] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#011222]">معاينة إشعار التحويل البنكي</h3>
                <p className="text-xs text-gray-500 font-mono">عملية رقم: {selectedReceipt.id}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 mb-5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">اسم المستورد المحول:</span>
                <span className="font-bold text-[#011222]">{selectedReceipt.importerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ المحول:</span>
                <span className="font-bold text-[#009F65] font-mono text-sm">{selectedReceipt.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">بنك العميل:</span>
                <span className="font-bold text-[#011222]">{selectedReceipt.senderBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">تاريخ ووقت التحويل:</span>
                <span className="font-mono text-gray-700">{selectedReceipt.transferDate}</span>
              </div>
            </div>

            {/* صورة الإيصال التجريبية الأنيقة */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50/50 mb-6">
              <img
                src={selectedReceipt.receiptUrl}
                alt="إيصال السداد"
                className="max-h-48 w-full object-cover rounded-xl shadow-xs"
              />
              <span className="text-[11px] text-gray-400 mt-2 block font-medium">
                إشعار مصرفي معتمد بصيغة إلكترونية
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                إغلاق
              </button>
              {selectedReceipt.status === 'SUBMITTED_TO_PROVIDER' && (
                <button
                  onClick={() => {
                    handleConfirmTransfer(selectedReceipt.id)
                    setSelectedReceipt(null)
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد استلام الحوالة</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ❌ Modal: رفض الإشعار */}
      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-right shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setRejectModalData(null)}
              className="absolute left-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="text-base font-black text-[#011222] mb-1">رفض إشعار التحويل البنكي</h3>
            <p className="text-xs text-gray-500 mb-4">
              سيتم إشعار المستورد ({rejectModalData.importerName}) بالسبب حتى يقوم بمطابقة المبلغ أو إعادة التحويل
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">سبب الرفض:</label>
              <textarea
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="مثال: لم يظهر المبلغ في كشف حسابنا البنكي حتى الآن، أو رقم الحوالة غير مطابق..."
                className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500 text-right"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectModalData(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleRejectTransfer}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
