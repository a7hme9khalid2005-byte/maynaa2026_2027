import { useState, useEffect } from 'react'
import ImporterSidebar from '../../../components/dashboard/ImporterSidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import financeService from '../../../services/financeService'
import {
  Wallet,
  Search,
  Bell,
  X,
  Building2,
  Copy,
  Check,
  UploadCloud,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus
} from 'lucide-react'

const initialTransactions = [
  {
    id: 'TRX-984210',
    date: '2026-11-23',
    description: 'سداد شحنة SHN-2026-884 (تحويل بنكي خارجي لمزود الخدمة)',
    currency: 'USD',
    currencySymbol: '$',
    subtotal: 13800,
    commissionRate: 0.0,
    commissionAmount: 0.0,
    isTrial: true,
    amount: '$13,800',
    amountNum: 13800,
    status: 'في انتظار تدقيق الإدارة',
    statusBg: '#FEF3C7',
    statusColor: '#D97706'
  },
  {
    id: 'TRX-98122',
    date: '2026-11-20',
    description: 'تحويل بنكي خارجي - شحنة ميناء العقبة (دينار)',
    currency: 'DINAR',
    currencySymbol: 'د.أ',
    subtotal: 1200,
    commissionRate: 0.025,
    commissionAmount: 30,
    isTrial: false,
    amount: '1,230 د.أ',
    amountNum: 1230,
    status: 'مؤكد من المزود ومفعّل',
    statusBg: '#E6F9F0',
    statusColor: '#009F65'
  },
  {
    id: 'TRX-98222',
    date: '2026-11-18',
    description: 'تحويل بنكي خارجي - شحنة هامبورغ إلى جدة (يورو)',
    currency: 'EUR',
    currencySymbol: '€',
    subtotal: 2400,
    commissionRate: 0.025,
    commissionAmount: 60,
    isTrial: false,
    amount: '€2,460',
    amountNum: 2460,
    status: 'مؤكد من المزود ومفعّل',
    statusBg: '#E6F9F0',
    statusColor: '#009F65'
  },
  {
    id: 'TRX-98322',
    date: '2026-11-15',
    description: 'تحويل بنكي خارجي - توريد إلكترونيات (دولار)',
    currency: 'USD',
    currencySymbol: '$',
    subtotal: 3600,
    commissionRate: 0.0,
    commissionAmount: 0.0,
    isTrial: true,
    amount: '$3,600',
    amountNum: 3600,
    status: 'معتمد إدارياً - بانتظار تأكيد المزود',
    statusBg: '#E0F2FE',
    statusColor: '#0284C7'
  }
]

export default function ImporterPaymentsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoSarah = currentUser?.email === 'importer@meynaa.com'

  const [searchTerm, setSearchTerm] = useState('')
  const [transactions, setTransactions] = useState(() => (isDemoSarah ? initialTransactions : []))
  const [showDirectTransferModal, setShowDirectTransferModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [copiedIban, setCopiedIban] = useState(false)

  // حالة الفترة التجريبية (3 أيام مجانية) للمستخدم الحالي
  const [trialInfo, setTrialInfo] = useState({
    isActive: true,
    daysRemaining: 2,
    commissionRate: 0.0, // 0% أثناء التجربة، وتصبح 2.5% بعد التجربة
  })

  useEffect(() => {
    // الاتصال بالباك إند للتحقق من حالة الـ 3 أيام المجانية للمستخدم
    financeService.getTrialStatus()
      .then((res) => {
        if (res?.data) {
          setTrialInfo({
            isActive: res.data.isTrialActive,
            daysRemaining: res.data.daysRemaining,
            commissionRate: res.data.commissionRate,
          })
        }
      })
      .catch(() => {
        // استمرار العمل بالقيم التجريبية في حال العمل بدون سيرفر
      })
  }, [])

  // بيانات نموذج التحويل البنكي الخارجي
  const [transferData, setTransferData] = useState(() => ({
    shipmentNumber: 'SHN-2026-884',
    currency: 'USD', // USD, DINAR, EUR
    subtotal: '1000',
    senderBank: 'مصرف محلي معتمد',
    senderName: currentUser?.fullName || (isDemoSarah ? 'مجموعة الريادة للمقاولات' : 'صاحب المنشأة'),
    referenceNumber: '',
    fileName: '',
  }))

  const providerBankDetails = {
    providerName: 'شركة الفرسان للخدمات اللوجستية المحدودة',
    bankName: 'مصرف الراجحي',
    iban: 'SA4480000123456789012345',
    crNumber: '1010894521',
  }

  const copyIban = () => {
    navigator.clipboard.writeText(providerBankDetails.iban)
    setCopiedIban(true)
    setTimeout(() => setCopiedIban(false), 2500)
  }

  // حساب العمولة والإجمالي بناء على العملة والفترة التجريبية
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'DINAR': return 'د.أ'
      case 'EUR': return '€'
      case 'USD':
      default: return '$'
    }
  }

  const basePrice = parseFloat(transferData.subtotal) || 0
  const effectiveCommissionRate = trialInfo.isActive ? 0.0 : 0.025
  const commissionAmount = parseFloat((basePrice * effectiveCommissionRate).toFixed(2))
  const totalAmount = parseFloat((basePrice + commissionAmount).toFixed(2))
  const currencySymbol = getCurrencySymbol(transferData.currency)

  const filteredTransactions = transactions.filter((tx) =>
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.description.includes(searchTerm) ||
    tx.date.includes(searchTerm) ||
    tx.amount.includes(searchTerm)
  )

  const handleSubmitTransferToAdmin = async (e) => {
    e.preventDefault()
    const refNum = transferData.referenceNumber ? `TRX-${transferData.referenceNumber}` : `TRX-${Math.floor(98700 + Math.random() * 200)}`

    // إرسال الإشعار للباك إند الحقيقي
    try {
      const formData = new FormData()
      formData.append('invoiceId', 'INV-2026-0042')
      formData.append('currency', transferData.currency)
      formData.append('subtotalAmount', basePrice)
      formData.append('transferAmount', totalAmount)
      formData.append('senderBankName', transferData.senderBank)
      formData.append('senderAccountName', transferData.senderName)
      formData.append('transferRefNumber', refNum)
      formData.append('transferDate', new Date().toISOString())
      await financeService.submitTransferToAdmin(formData)
    } catch {
      // استمرار التحديث محلياً بسلاسة
    }

    const newTx = {
      id: refNum,
      date: new Date().toISOString().split('T')[0],
      description: `سداد شحنة ${transferData.shipmentNumber} (تحويل بنكي خارجي)`,
      currency: transferData.currency,
      currencySymbol,
      subtotal: basePrice,
      commissionRate: effectiveCommissionRate,
      commissionAmount,
      isTrial: trialInfo.isActive,
      amount: transferData.currency === 'USD' ? `$${totalAmount.toLocaleString()}` : `${totalAmount.toLocaleString()} ${currencySymbol}`,
      amountNum: totalAmount,
      status: 'في انتظار تدقيق الإدارة',
      statusBg: '#FEF3C7',
      statusColor: '#D97706'
    }

    setTransactions([newTx, ...transactions])
    setShowDirectTransferModal(false)
    setToastMessage(`تم إرسال إشعار التحويل البنكي الخارجي إلى إدارة المنصة للتدقيق، وسيقوم الأدمن بمراجعته وإحالته لمزود الخدمة!`)
    setTimeout(() => setToastMessage(null), 5500)
  }

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-20"
        aria-hidden="true"
      ></div>

      {/* Decorative Warm Orange Shape at Bottom-Right Corner */}
      <div
        className="absolute -bottom-16 right-[300px] w-72 h-44 bg-[#FB8731]/80 rounded-[40px] rotate-12 pointer-events-none z-0 blur-xs"
        aria-hidden="true"
      ></div>

      {/* Importer Sidebar */}
      <ImporterSidebar activePath="/importer/payments" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top Header Bar */}
        <header className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl border border-[#FB8731]/30 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
              <Wallet className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#011222]">المدفوعات والحسابات</h1>
              <p className="text-[11px] text-gray-400 font-medium">سداد دفعات الشحن عبر التحويل البنكي الخارجي بنسبة 100%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="...ابحث"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-right pr-9 focus:outline-none focus:border-[#FB8731]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>

            <button
              onClick={openNotifications}
              title="الإشعارات"
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-500 relative transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FB8731] absolute top-2.5 right-2.5 ring-2 ring-white"></span>
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

        {/* شريط حالة الفترة التجريبية المجانية (أول 3 أيام) */}
        {trialInfo.isActive ? (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-900">أنت في الفترة التجريبية المجانية (3 أيام)!</span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    متبقي {trialInfo.daysRemaining} يوم
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  عمولة المنصة حالياً <strong className="text-emerald-900">0.0% مجاناً</strong> على كافة التحويلات. بعد انتهاء الـ 3 أيام ستصبح العمولة 2.5%.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5" />
              <span>عمولة 0%</span>
            </span>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-blue-900">حساب مفعّل - عمولة المنصة القياسية 2.5%</span>
                <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                  يتم احتساب عمولة 2.5% على إجمالي قيمة التحويل البنكي الخارجي للشحنات.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* تنبيه إرشادي بارز حول آلية التحويل الخارجي وتسلسل الاعتماد */}
        <div className="bg-[#FFF8F1] border border-[#FB8731]/40 rounded-2xl p-4 flex items-start gap-3.5 text-right shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FB8731]/15 text-[#FB8731] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xs font-black text-[#011222]">التحويل المالي خارج المنصة 100% (تسلسل الاعتماد: إدارة ثم مزود)</h2>
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-1">
              المنصة لا تخصم أي أموال داخلية. تقوم بالتحويل من تطبيقك البنكي أو الصراف الآلي مباشرة لآيبان مزود الخدمة، ثم ترفع إشعار التحويل هنا. <strong className="text-[#011222]">يصل الإشعار أولاً لإدارة المنصة للتدقيق والتأكد من العمولة، ثم يحال تلقائياً لمزود الخدمة</strong> لمطابقته مع حسابه البنكي وتفعيل الشحنة.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#F4FDF7] rounded-[24px] p-6 border border-emerald-100/80 shadow-xs text-center flex flex-col items-center justify-center min-h-[160px]">
            <span className="text-xs font-bold text-gray-500 mb-1.5 block">وفورات الفترة التجريبية وعروض الأسعار</span>
            <span className="text-3xl lg:text-4xl font-black text-[#009F65] leading-none font-sans block">
              $1,200
            </span>
            <span className="text-xs font-bold text-[#009F65] mt-3 block">
              عمولة 0% مفعلة حالياً
            </span>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xs text-center flex flex-col items-center justify-center min-h-[160px]">
            <span className="text-xs font-bold text-gray-500 mb-1.5 block">العملات المدعومة</span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-[#011222]">USD ($)</span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-[#011222]">دينار (د.أ)</span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-[#011222]">EUR (€)</span>
            </div>
            <span className="text-xs font-bold text-[#0284C7] mt-3 block">
              تحويلات بنكية مباشرة
            </span>
          </div>

          {/* كرت التحويل البنكي الخارجي */}
          <div className="bg-white rounded-[24px] p-6 border border-orange-200/80 shadow-xs text-center flex flex-col items-center justify-center min-h-[160px]">
            <span className="text-xs font-bold text-gray-600 mb-1 block">السداد البنكي الخارجي</span>
            <p className="text-[11px] text-[#64748B] font-medium mb-3">
              تحويل مباشر خارج الموقع ورفع الإشعار للإدارة
            </p>
            <button
              onClick={() => setShowDirectTransferModal(true)}
              className="w-full bg-[#FB8731] hover:bg-[#e67520] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>رفع إشعار تحويل بنكي خارجي</span>
            </button>
          </div>
        </section>

        {/* Main Card: سجل المعاملات */}
        <section className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base lg:text-lg font-black text-[#011222]">سجل الحوالات البنكية الخارجية</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">متابعة حالة اعتماد الإشعارات من قِبل الإدارة ثم مزودي الخدمة</p>
            </div>
            <button
              onClick={() => setShowDirectTransferModal(true)}
              className="bg-[#011222] hover:bg-[#021f3d] text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#FB8731]" />
              <span>إرسال إشعار تحويل جديد</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400">
                  <th className="py-3 px-4">رقم العملية</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">تفاصيل الشحنة</th>
                  <th className="py-3 px-4 text-center">العملة والعمولة</th>
                  <th className="py-3 px-4">المبلغ الإجمالي المحول</th>
                  <th className="py-3 px-4 text-center">حالة الاعتماد المتسلسل</th>
                  <th className="py-3 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#011222]">{tx.id}</td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">{tx.date}</td>
                    <td className="py-3.5 px-4 font-bold text-[#011222]">
                      <div>{tx.description}</div>
                      <span className="text-[10px] text-gray-400 font-normal">تحويل بنكي حقيقي لحساب المزود</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-[#011222] text-[11px]">
                          {tx.currency === 'USD' ? 'دولار ($)' : tx.currency === 'DINAR' ? 'دينار (د.أ)' : 'يورو (€)'}
                        </span>
                        <span className={`text-[10px] font-bold ${tx.isTrial ? 'text-emerald-600' : 'text-blue-600'}`}>
                          {tx.isTrial ? 'فترة تجريبية (0%)' : 'عمولة منصة (2.5%)'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black font-mono text-[#011222] text-sm">
                      {tx.amount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-bold"
                        style={{ backgroundColor: tx.statusBg, color: tx.statusColor }}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => alert(`عرض تفاصيل الحوالة البنكية: ${tx.id}`)}
                        className="text-[#FB8731] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>معاينة</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#FB8731] flex items-center justify-center mb-3">
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#011222]">لا توجد حوالات أو معاملات مسجلة بعد</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  ستظهر هنا كافة إيصالات السداد والحوالات البنكية الخارجية المعتمدة لشحناتك مع إمكانية تحميل الفواتير.
                </p>
                <button
                  onClick={() => setShowDirectTransferModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FB8731] text-white text-xs font-bold rounded-xl hover:bg-[#e07220] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>رفع إشعار تحويل بنكي جديد</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer Bar */}
        <DashboardFooterBar />
      </main>

      {/* Modal: رفع إشعار تحويل بنكي خارجي لمزود الخدمة (يصل للأدمن أولاً) */}
      {showDirectTransferModal && (
        <div className="fixed inset-0 z-50 bg-[#011222]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-right shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] text-[#FB8731] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#011222]">رفع إشعار تحويل بنكي خارجي</h3>
                  <p className="text-[11px] text-gray-400 font-medium">التحويل يتم خارج المنصة بنكياً ويُدقق من الإدارة أولاً</p>
                </div>
              </div>
              <button
                onClick={() => setShowDirectTransferModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* بطاقة الحساب البنكي لمزود الخدمة المستلم */}
            <div className="bg-[#011222] text-white rounded-2xl p-4 space-y-2.5 mb-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-gray-400">المستفيد (مزود الخدمة):</span>
                <span className="font-bold text-white">{providerBankDetails.providerName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-gray-400">البنك المستلم:</span>
                <span className="font-bold text-white">{providerBankDetails.bankName}</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-300 block">رقم الآيبان الرسمي للمزود (IBAN):</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider block mt-0.5">
                    {providerBankDetails.iban}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyIban}
                  className="bg-[#FB8731] hover:bg-[#e67520] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  {copiedIban ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIban ? 'تم النسخ' : 'نسخ الآيبان'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitTransferToAdmin} className="space-y-3.5 text-xs font-bold">
              {/* اختيار العملة المدعومة */}
              <div>
                <label className="block text-gray-700 mb-1.5">عملة التحويل المالي</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'USD', name: 'دولار أمريكي', sym: '$' },
                    { id: 'DINAR', name: 'دينار', sym: 'د.أ' },
                    { id: 'EUR', name: 'يورو', sym: '€' },
                  ].map((cur) => (
                    <button
                      key={cur.id}
                      type="button"
                      onClick={() => setTransferData({ ...transferData, currency: cur.id })}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        transferData.currency === cur.id
                          ? 'border-[#FB8731] bg-[#FFF8F1] text-[#FB8731] font-black'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="block text-xs">{cur.name}</span>
                      <span className="font-mono text-[11px]">{cur.sym}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">رقم الشحنة</label>
                  <input
                    type="text"
                    required
                    value={transferData.shipmentNumber}
                    onChange={(e) => setTransferData({ ...transferData, shipmentNumber: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-right font-mono focus:outline-none focus:border-[#FB8731]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">قيمة الشحن الأساسية ({currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={transferData.subtotal}
                    onChange={(e) => setTransferData({ ...transferData, subtotal: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-right font-mono focus:outline-none focus:border-[#FB8731]"
                  />
                </div>
              </div>

              {/* حاسبة العمولة والإجمالي الواجب تحويله */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-gray-600">
                  <span>سعر الشحنة الأساسي:</span>
                  <span className="font-mono font-bold text-[#011222]">{basePrice.toLocaleString()} {currencySymbol}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>عمولة المنصة:</span>
                    {trialInfo.isActive ? (
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        (مجاناً - أول 3 أيام 0%)
                      </span>
                    ) : (
                      <span className="text-gray-500 text-[10px]">(2.5%)</span>
                    )}
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    {trialInfo.isActive ? '0.00' : commissionAmount.toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-1.5 flex items-center justify-between text-xs font-black text-[#011222]">
                  <span>المبلغ المطلوب تحويله بنكياً:</span>
                  <span className="font-mono text-[#FB8731] text-sm">
                    {totalAmount.toLocaleString()} {currencySymbol}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">اسم بنكك الذي حولت منه</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مصرف الإنماء"
                    value={transferData.senderBank}
                    onChange={(e) => setTransferData({ ...transferData, senderBank: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-right focus:outline-none focus:border-[#FB8731]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">رقم الحوالة البنكية (من الإيصال)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: TXN-984210"
                    value={transferData.referenceNumber}
                    onChange={(e) => setTransferData({ ...transferData, referenceNumber: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-right font-mono focus:outline-none focus:border-[#FB8731]"
                  />
                </div>
              </div>

              {/* رفع ملف إشعار التحويل الخارجي */}
              <div>
                <label className="block text-gray-700 mb-1">صورة إشعار أو وصل التحويل البنكي (JPG, PNG, PDF)</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-[#FB8731] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    id="receipt-file-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setTransferData({ ...transferData, fileName: e.target.files[0].name })
                      }
                    }}
                  />
                  <label htmlFor="receipt-file-input" className="cursor-pointer block">
                    <UploadCloud className="w-7 h-7 mx-auto text-[#FB8731] mb-1.5" />
                    <span className="text-xs font-bold text-gray-700 block">
                      {transferData.fileName ? transferData.fileName : 'انقر لرفع صورة إشعار الحوالة البنكية'}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">الحد الأقصى 10 ميجابايت</span>
                  </label>
                </div>
              </div>

              {/* تنبيه تسلسل الاعتماد للأدمن أولاً */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>سيصل إشعار التحويل إلى إدارة المنصة أولاً للتدقيق والاعتماد قبل إحالته للمزود.</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#FB8731] hover:bg-[#e67520] text-white py-3 rounded-xl font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>إرسال الإشعار لتدقيق الإدارة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDirectTransferModal(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
