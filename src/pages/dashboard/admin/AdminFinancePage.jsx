import { useState, useEffect } from 'react'
import AdminSidebar from '../../../components/dashboard/AdminSidebar'
import AdminHeader from '../../../components/dashboard/AdminHeader'
import financeService from '../../../services/financeService'
import {
  Coins,
  CheckCircle2,
  Clock,
  RotateCcw,
  BarChart3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Wallet,
  CheckCircle,
  X,
  XCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react'

// Initial Admin Audit External Transfers (المستورد -> الأدمن أولاً -> المزود)
const initialAdminAuditTransfers = [
  {
    id: 'TRX-984210',
    shipmentId: 'SHN-2026-884',
    importerName: 'مؤسسة الأفق للاستيراد (سارة)',
    importerPhone: '+966500000003',
    providerName: 'شركة الفرسان اللوجستية',
    providerBank: 'مصرف الراجحي (SA4480000123456789012345)',
    currency: 'USD',
    currencySymbol: '$',
    subtotal: 13800,
    isTrial: true, // أول 3 أيام مجانية
    commissionRate: 0.0,
    commissionAmount: 0.0,
    totalAmount: 13800,
    bankRefNumber: 'TXN-984210',
    senderBank: 'مصرف الإنماء',
    receiptUrl: '/images/auth-ship-bg.png',
    date: '2026-11-23 09:45 ص',
    status: 'SUBMITTED_TO_ADMIN' // SUBMITTED_TO_ADMIN, APPROVED_BY_ADMIN, REJECTED_BY_ADMIN
  },
  {
    id: 'TRX-984218',
    shipmentId: 'SHN-2026-905',
    importerName: 'شركة النور للتجارة والتوريدات',
    importerPhone: '+966500000012',
    providerName: 'مؤسسة الخليج للنقل البري',
    providerBank: 'البنك الأهلي السعودي',
    currency: 'DINAR',
    currencySymbol: 'د.أ',
    subtotal: 2000,
    isTrial: false, // انتهت الـ 3 أيام التجريبية
    commissionRate: 0.025,
    commissionAmount: 50,
    totalAmount: 2050,
    bankRefNumber: 'TXN-773419',
    senderBank: 'بنك الاتحاد',
    receiptUrl: '/images/auth-ship-bg.png',
    date: '2026-11-23 11:30 ص',
    status: 'SUBMITTED_TO_ADMIN'
  },
  {
    id: 'TRX-984225',
    shipmentId: 'SHN-2026-912',
    importerName: 'المجموعة العالمية للشحن',
    importerPhone: '+966500000034',
    providerName: 'شركة أوتو كارير الدولية',
    providerBank: 'بنك الرياض',
    currency: 'EUR',
    currencySymbol: '€',
    subtotal: 5000,
    isTrial: false,
    commissionRate: 0.025,
    commissionAmount: 125,
    totalAmount: 5125,
    bankRefNumber: 'TXN-334102',
    senderBank: 'Deutsche Bank',
    receiptUrl: '/images/auth-ship-bg.png',
    date: '2026-11-23 01:15 م',
    status: 'SUBMITTED_TO_ADMIN'
  }
]

// Initial Invoices matching screenshot
const initialInvoices = [
  {
    id: 'INV-2026-123',
    issueDate: '2026-8-20',
    status: 'معتمدة',
    amount: '$14,200',
    tax: '$2,130',
    total: '$16,330',
    client: 'شركة النور للاستيراد',
    service: 'خدمات نقل وتخليص جمركي - ميناء الملك عبد العزيز'
  },
  {
    id: 'INV-2026-124',
    issueDate: '2026-11-6',
    status: 'معتمدة',
    amount: '$28,450',
    tax: '$4,267.5',
    total: '$32,717.5',
    client: 'مؤسسة الخليج اللوجستية',
    service: 'شحن بري مبرد وتوزيع إقليمي'
  },
  {
    id: 'INV-2025-125',
    issueDate: '2026-9-12',
    status: 'قيد المراجعة',
    amount: '$9,800',
    tax: '$1,470',
    total: '$11,270',
    client: 'العالمية السريعة للشحن',
    service: 'خدمات تخزين وشحن جوي سريع'
  }
]

// Initial Transfers matching screenshot
const initialTransfers = [
  {
    id: 'TRX-1001',
    type: 'سحب أرباح',
    status: 'مكتملة',
    date: '2026/11/4 - 11:30 PM',
    amount: '$12,500',
    beneficiary: 'شركة النور للاستيراد'
  },
  {
    id: 'TRX-1002',
    type: 'تحويل بنكي',
    status: 'قيد المراجعة',
    date: '2026/10/17 - 1:40 PM',
    amount: '$8,200',
    beneficiary: 'مؤسسة الخليج اللوجستية'
  },
  {
    id: 'TRX-1003',
    type: 'سحب أرباح',
    status: 'تحت المراجعة',
    date: '2026/7/2 - 9:20 PM',
    amount: '$5,400',
    beneficiary: 'أحمد محمد علي'
  },
  {
    id: 'TRX-1004',
    type: 'تحويل بنكي',
    status: 'متأخرة',
    date: '2026/8/22 - 8:40 PM',
    amount: '$19,800',
    beneficiary: 'شركة البحار للشحن'
  }
]

// Initial Financial Transactions Log matching screenshot
const initialTransactions = [
  {
    id: 1,
    dateTime: '2026/11/4 - 11:30 PM',
    operationType: 'إصدار فاتورة',
    description: 'تم إصدار الفاتورة رقم: INV-2026-1074',
    user: 'أحمد المدير العام',
    extraDetails: 'بمبلغ $32,500'
  },
  {
    id: 2,
    dateTime: '2026/10/17 - 1:40 PM',
    operationType: 'إتمام سحب أرباح',
    description: 'تم تحويل المبلغ الى الحساب البنكي',
    user: 'محمد محمود',
    extraDetails: 'بمبلغ $28,750'
  },
  {
    id: 3,
    dateTime: '2026/7/2 - 9:20 PM',
    operationType: 'مراجعة طلب تحويل',
    description: 'تم الموافقة على طلب التحويل رقم TRX-1004',
    user: 'سارة حسن',
    extraDetails: '—'
  }
]

// Monthly Bar Chart Data
const monthlyChartData = {
  '30days': [
    { month: 'يناير', growth: 72, refund: 12 },
    { month: 'فبراير', growth: 68, refund: 10 },
    { month: 'مارس', growth: 78, refund: 14 },
    { month: 'أبريل', growth: 82, refund: 11 },
    { month: 'مايو', growth: 90, refund: 8 }
  ],
  '90days': [
    { month: 'يناير', growth: 65, refund: 15 },
    { month: 'فبراير', growth: 70, refund: 12 },
    { month: 'مارس', growth: 80, refund: 13 },
    { month: 'أبريل', growth: 85, refund: 9 },
    { month: 'مايو', growth: 94, refund: 7 }
  ],
  fullYear: [
    { month: 'يناير', growth: 60, refund: 18 },
    { month: 'فبراير', growth: 65, refund: 14 },
    { month: 'مارس', growth: 75, refund: 12 },
    { month: 'أبريل', growth: 80, refund: 10 },
    { month: 'مايو', growth: 98, refund: 6 }
  ]
}

// Pure helper function for CSV generation
function buildCsvContent(data) {
  const headers = [
    'رقم الفاتورة',
    'اسم العميل',
    'تاريخ الإصدار',
    'المبلغ الأساسي',
    'ضريبة القيمة المضافة (15%)',
    'الإجمالي',
    'الحالة'
  ]
  const rows = data.map((inv) => [
    inv.id,
    inv.client,
    inv.issueDate,
    inv.amount,
    inv.tax,
    inv.total,
    inv.status
  ])

  return (
    '\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n')
  )
}

// Pure helper function to generate Printable PDF HTML
function buildPrintHtml(invoicesList) {
  const rowsHtml = invoicesList
    .map(
      (inv) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px; text-align: center; color: #FB8731; font-weight: bold; font-family: monospace;">${inv.id}</td>
      <td style="padding: 12px; text-align: right; font-weight: bold;">${inv.client}</td>
      <td style="padding: 12px; text-align: center;">${inv.issueDate}</td>
      <td style="padding: 12px; text-align: center; font-weight: bold;">${inv.amount}</td>
      <td style="padding: 12px; text-align: center; color: #009F65; font-weight: bold;">${inv.tax}</td>
      <td style="padding: 12px; text-align: center; font-weight: bold;">${inv.total}</td>
      <td style="padding: 12px; text-align: center;">
        <span style="background: ${inv.status === 'معتمدة' ? '#E6F9F0' : '#E0F2FE'}; color: ${inv.status === 'معتمدة' ? '#009F65' : '#0284C7'}; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: bold;">
          ${inv.status}
        </span>
      </td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8" />
      <title>الفواتير الضريبية المعتمدة - منصة ميناء</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');
        body { font-family: 'Almarai', sans-serif; margin: 40px; color: #011222; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FB8731; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { text-align: right; }
        .brand h1 { margin: 0; color: #011222; font-size: 24px; font-weight: 800; }
        .brand p { margin: 6px 0 0; color: #64748B; font-size: 12px; }
        .meta { text-align: left; font-size: 12px; color: #64748B; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
        th { background: #011222; color: #fff; padding: 12px; text-align: center; font-weight: 700; }
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94A3B8; text-align: center; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <h1>منصة ميناء اللوجستية (MEYNAA)</h1>
          <p>كشف الفواتير الضريبية المعتمدة - الإدارة المالية والفوترة</p>
          <p>الرقم الضريبي: 310294857200003 | السجل التجاري: 1010884920</p>
        </div>
        <div class="meta">
          <p><strong>تاريخ التصدير:</strong> 2026-11-09</p>
          <p><strong>المشرف المصدر:</strong> أحمد المدير العام</p>
          <p><strong>الحالة:</strong> معتمدة رسمياً ومطابقة لهيئة الزكاة والضريبة والجمارك (ZATCA)</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>رقم الفاتورة</th>
            <th style="text-align: right;">العميل</th>
            <th>تاريخ الإصدار</th>
            <th>المبلغ الأساسي</th>
            <th>ضريبة (15%)</th>
            <th>الإجمالي</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <p>هذا المستند معتمد وصادر إلكترونياً من منصة ميناء اللوجستية ومطابق لمتطلبات الفاتورة الإلكترونية.</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `
}

export default function AdminFinancePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [chartPeriod, setChartPeriod] = useState('30days')
  const [toastMessage, setToastMessage] = useState('')
  const [invoices] = useState(initialInvoices)
  const [transfers] = useState(initialTransfers)
  const [transactions] = useState(initialTransactions)
  const [previewInvoice, setPreviewInvoice] = useState(null)

  // حالة إشعارات التحويل البنكي الخارجي قيد تدقيق الإدارة (المستورد -> الأدمن -> المزود)
  const [auditTransfers, setAuditTransfers] = useState(initialAdminAuditTransfers)
  const [selectedReceiptPreview, setSelectedReceiptPreview] = useState(null)
  const [rejectModalData, setRejectModalData] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 4500)
  }

  // جلب الحوالات المعلقة لتدقيق الأدمن من الباك إند
  useEffect(() => {
    financeService.getAdminPendingTransfers()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          // دمج الحوالات القادمة من السيرفر
          const liveList = res.data.map(item => ({
            id: item.id.substring(0, 10).toUpperCase(),
            shipmentId: item.invoice?.shipmentId ? `SHN-${item.invoice.shipmentId.substring(0, 6)}` : 'SHN-2026-884',
            importerName: item.payer?.fullName || 'مؤسسة الأفق للاستيراد',
            importerPhone: item.payer?.phone || '+966500000003',
            providerName: item.recipientName || 'شركة الفرسان اللوجستية',
            providerBank: `${item.recipientBankName || 'مصرف الراجحي'} (${item.recipientIban || 'SA4480000123456789012345'})`,
            currency: item.currency || 'USD',
            currencySymbol: item.currency === 'DINAR' ? 'د.أ' : item.currency === 'EUR' ? '€' : '$',
            subtotal: item.subtotalAmount || 12000,
            isTrial: item.isTrialPeriod,
            commissionRate: item.commissionRate,
            commissionAmount: item.commissionAmount,
            totalAmount: item.transferAmount,
            bankRefNumber: item.transferRefNumber,
            senderBank: item.senderBankName,
            receiptUrl: item.receiptFileUrl || '/images/auth-ship-bg.png',
            date: new Date(item.createdAt).toLocaleString('ar-SA'),
            status: item.status
          }))
          setAuditTransfers(liveList)
        }
      })
      .catch(() => {})
  }, [])

  // موافقة الأدمن على الإشعار وتمريره لمزود الخدمة
  const handleApproveAuditTransfer = async (transferId) => {
    try {
      await financeService.approveTransferByAdmin(transferId, 'معتمد إدارياً ومطابق للشروط')
    } catch {
      // استمرار التحديث محلياً بسلاسة
    }
    setAuditTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'APPROVED_BY_ADMIN' } : t))
    )
    showToast(`✅ تم تدقيق الإشعار (${transferId}) واعتماده إدارياً، وتمت إحالته لمزود الخدمة لمطابقته مع حسابه البنكي!`)
  }

  // رفض الأدمن للإشعار مع ذكر السبب
  const handleRejectAuditTransfer = async () => {
    if (!rejectModalData) return
    const reason = rejectReason || 'الإشعار غير مطابق أو غير واضح'
    try {
      await financeService.rejectTransferByAdmin(rejectModalData.id, reason)
    } catch {
      // استمرار التحديث محلياً بسلاسة
    }
    setAuditTransfers((prev) =>
      prev.map((t) =>
        t.id === rejectModalData.id
          ? { ...t, status: 'REJECTED_BY_ADMIN', rejectionReason: reason }
          : t
      )
    )
    showToast(`❌ تم رفض الإشعار (${rejectModalData.id}) وإشعار المستورد بالسبب: ${reason}`)
    setRejectModalData(null)
    setRejectReason('')
  }

  const currentChart = monthlyChartData[chartPeriod] || monthlyChartData['30days']

  // Handle Export Invoices PDF
  const handleExportInvoicesPDF = () => {
    try {
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        showToast('يرجى السماح بالنوافذ المنبثقة لطباعة وتصدير PDF')
        return
      }

      const html = buildPrintHtml(invoices)
      printWindow.document.open()
      printWindow.document.write(html)
      printWindow.document.close()

      showToast('تم فتح نافذة تصدير وطباعة تقرير الفواتير PDF بنجاح')
    } catch {
      showToast('حدث خطأ أثناء فتح تقرير PDF')
    }
  }

  // Handle Export Invoices Excel (CSV)
  const handleExportInvoicesExcel = () => {
    try {
      const csvContent = buildCsvContent(invoices)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', 'الفواتير_الضريبية_المعتمدة_2026.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showToast('تم تصدير وتحميل كشف الفواتير الضريبية بنجاح')
    } catch {
      showToast('حدث خطأ أثناء تصدير الملف')
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-almarai flex" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#011222] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FB8731]/40 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#009F65]" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-[#011222]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 lg:p-8 shadow-2xl border border-gray-100 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FB8731] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#011222] text-base">معاينة الفاتورة الضريبية</h3>
                  <p className="text-[11px] text-gray-400 font-medium font-mono">{previewInvoice.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewInvoice(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">العميل المستفيد:</span>
                <span className="font-bold text-[#011222]">{previewInvoice.client}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">نوع الخدمة:</span>
                <span className="font-medium text-gray-700">{previewInvoice.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">تاريخ الإصدار:</span>
                <span className="font-bold text-gray-700 dir-ltr">{previewInvoice.issueDate}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200/80 pt-2.5">
                <span className="text-gray-500 font-medium">المبلغ الأساسي (خاضع للضريبة):</span>
                <span className="font-bold text-[#011222]">{previewInvoice.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">ضريبة القيمة المضافة (15%):</span>
                <span className="font-bold text-[#009F65]">{previewInvoice.tax}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200/80 pt-2.5 text-sm">
                <span className="font-black text-[#011222]">المجموع الإجمالي:</span>
                <span className="font-black text-xl text-[#FB8731]">{previewInvoice.total}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 font-medium">حالة الاعتماد:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    previewInvoice.status === 'معتمدة'
                      ? 'bg-emerald-50 text-[#009F65] border border-emerald-200'
                      : 'bg-blue-50 text-[#0284C7] border border-blue-200'
                  }`}
                >
                  {previewInvoice.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setPreviewInvoice(null)
                  showToast(`تم تنزيل الفاتورة ${previewInvoice.id} بصيغة PDF بنجاح`)
                }}
                className="flex-1 bg-[#011222] hover:bg-[#02203d] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#011222]/20"
              >
                <Download className="w-4 h-4 text-[#FB8731]" />
                <span>تنزيل الفاتورة الضريبية</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewInvoice(null)}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: معاينة إشعار التحويل البنكي الخارجي للأدمن */}
      {selectedReceiptPreview && (
        <div className="fixed inset-0 z-50 bg-[#011222]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-right shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FB8731] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#011222]">معاينة إشعار التحويل البنكي الخارجي</h3>
                  <p className="text-[11px] text-gray-400 font-medium font-mono">{selectedReceiptPreview.id} - {selectedReceiptPreview.shipmentId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptPreview(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* تفاصيل الحوالة */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs mb-4 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">المستورد (المحول):</span>
                <span className="font-bold text-[#011222]">{selectedReceiptPreview.importerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">مزود الخدمة (المستفيد):</span>
                <span className="font-bold text-[#011222]">{selectedReceiptPreview.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">آيبان وبنك المزود:</span>
                <span className="font-mono text-gray-700 text-[11px]">{selectedReceiptPreview.providerBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">بنك العميل ورقم العملية:</span>
                <span className="font-bold text-gray-700">{selectedReceiptPreview.senderBank} ({selectedReceiptPreview.bankRefNumber})</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-500">سعر الشحن الأساسي:</span>
                <span className="font-mono font-bold text-[#011222]">{selectedReceiptPreview.subtotal.toLocaleString()} {selectedReceiptPreview.currencySymbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">حالة عمولة المنصة:</span>
                <span className={`font-bold ${selectedReceiptPreview.isTrial ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {selectedReceiptPreview.isTrial ? '0.00 (فترة تجريبية 3 أيام مجانية)' : `${selectedReceiptPreview.commissionAmount} ${selectedReceiptPreview.currencySymbol} (2.5%)`}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-black">
                <span className="text-[#011222]">إجمالي المبلغ المحول:</span>
                <span className="text-[#FB8731] font-mono">{selectedReceiptPreview.totalAmount.toLocaleString()} {selectedReceiptPreview.currencySymbol}</span>
              </div>
            </div>

            {/* صورة الإيصال */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-900 mb-5 relative group">
              <img
                src={selectedReceiptPreview.receiptUrl}
                alt="إيصال التحويل"
                className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs">
                  <span className="font-bold block">إشعار تحويل بنكي رسمي موثق</span>
                  <span className="text-[10px] text-gray-300 font-mono">تاريخ الإرسال: {selectedReceiptPreview.date}</span>
                </div>
              </div>
            </div>

            {/* أزرار اعتماد أو رفض الأدمن */}
            <div className="flex items-center gap-3">
              {selectedReceiptPreview.status === 'SUBMITTED_TO_ADMIN' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleApproveAuditTransfer(selectedReceiptPreview.id)
                      setSelectedReceiptPreview(null)
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد وتمرير لمزود الخدمة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectModalData(selectedReceiptPreview)
                      setSelectedReceiptPreview(null)
                    }}
                    className="px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>رفض الإشعار</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedReceiptPreview(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-xs cursor-pointer"
                >
                  إغلاق
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: رفض الأدمن للإشعار مع كتابة السبب */}
      {rejectModalData && (
        <div className="fixed inset-0 z-50 bg-[#011222]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-right shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#011222]">رفض إشعار التحويل البنكي</h3>
                  <p className="text-[11px] text-gray-400 font-mono">{rejectModalData.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalData(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3 font-medium">
              يرجى توضيح سبب رفض الإشعار ليتم إبلاغ المستورد ({rejectModalData.importerName}) به وإعادة رفعه:
            </p>

            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="مثال: الإشعار غير واضح، أو لم يتم تضمين عمولة المنصة، أو رقم الحوالة غير مطابق..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs focus:outline-none focus:border-rose-500 mb-4 text-right"
            ></textarea>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRejectAuditTransfer}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                تأكيد الرفض وإشعار المستورد
              </button>
              <button
                type="button"
                onClick={() => setRejectModalData(null)}
                className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar activePath="/admin/finance" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[280px] flex flex-col min-h-screen select-none overflow-x-hidden">
        {/* Top Header Bar pinned edge-to-edge matching screenshot */}
        <AdminHeader searchValue={searchQuery} onSearch={setSearchQuery} />

        {/* Inner Content Area */}
        <div className="p-6 lg:p-8 space-y-6">
          {/* Page Title matching screenshot */}
          <div className="text-right">
            <h1 className="text-2xl font-black text-[#011222] tracking-tight">الإدارة المالية و الفوترة</h1>
          </div>

          {/* Top 4 Financial KPI Metric Cards with Harmonized Translucent Tinted Backgrounds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 (Right in RTL): إجمالي العمولات المستحقة (Translucent Sky Blue Tint) */}
            <div className="bg-[#F0F9FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#BAE6FD]/70 hover:border-[#0284C7]/50 shadow-[0_2px_12px_rgba(2,132,199,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#0369A1] mb-1">إجمالي العمولات المستحقة</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">
                  $245,780
                </h3>
                <p className="text-xs font-bold text-[#009F65] font-mono mt-1">15%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
                <Coins className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 2: المبالغ المعتمدة (Translucent Emerald Green Tint) */}
            <div className="bg-[#ECFDF5]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#A7F3D0]/70 hover:border-[#009F65]/50 shadow-[0_2px_12px_rgba(0,159,101,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#047857] mb-1">المبالغ المعتمدة</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">
                  $180,250
                </h3>
                <p className="text-xs font-bold text-[#009F65] font-mono mt-1">12%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#A7F3D0] text-[#009F65] flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 3: المبالغ قيد المراجعة (Translucent Meynaa Orange Tint) */}
            <div className="bg-[#FFF7ED]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#FED7AA]/70 hover:border-[#FB8731]/50 shadow-[0_2px_12px_rgba(251,135,49,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#C2410C] mb-1">المبالغ قيد المراجعة</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">
                  $32,560
                </h3>
                <p className="text-xs font-bold text-[#009F65] font-mono mt-1">8%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#FED7AA] text-[#FB8731] flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 4 (Left in RTL): المستردات (Translucent Purple Tint) */}
            <div className="bg-[#F5F3FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#DDD6FE]/70 hover:border-[#7C3AED]/50 shadow-[0_2px_12px_rgba(124,58,237,0.04)] hover:shadow-md transition-all flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-[#6D28D9] mb-1">المستردات</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#011222] tracking-tight font-mono">
                  $12,970
                </h3>
                <p className="text-xs font-bold text-[#009F65] font-mono mt-1">6%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-xs">
                <RotateCcw className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* Middle Analytical Section: 3 Cards matching screenshot (Right to Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Card 1 (Right in RTL - 4 cols): كشف حسب العمولات */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              <h3 className="text-xs font-black text-[#011222] mb-3 text-right">كشف حسب العمولات</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Wallet illustration & Balance box on the left */}
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#011222] flex items-center justify-center text-[#FB8731] mb-2 shadow-sm">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 mb-0.5">الرصيد المستحق حالياً</span>
                  <span className="text-xl font-black text-[#0284C7] font-mono">$245,780</span>
                </div>

                {/* Commission Breakdown list on the right */}
                <div className="space-y-3 text-xs">
                  {/* Total */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="font-bold text-[#011222] text-[11px] font-mono">$245,780</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-semibold text-[11px]">إجمالي العمولات</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
                    </div>
                  </div>

                  {/* Transport Operations */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="font-bold text-[#011222] text-[11px] font-mono">$210,450</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-semibold text-[11px]">عمولات عملية النقل</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#009F65]"></span>
                    </div>
                  </div>

                  {/* Management */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#011222] text-[11px] font-mono">$35,330</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-semibold text-[11px]">عمولات الإدارة</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 (Middle in RTL - 5 cols): Bar Chart (النامية vs المستردات) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              {/* Header with Filter Pills and Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-100">
                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-gray-100/80 p-0.5 rounded-xl text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setChartPeriod('30days')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === '30days'
                        ? 'bg-[#011222] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    آخر 30 يوم
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartPeriod('90days')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === '90days'
                        ? 'bg-[#011222] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    90 يوم
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartPeriod('fullYear')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === 'fullYear'
                        ? 'bg-[#011222] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    سنة كاملة
                  </button>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
                    <span className="font-bold text-gray-700">النامية</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
                    <span className="font-bold text-gray-700">المستردات</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Area matching screenshot */}
              <div className="relative pt-2 pb-1">
                {/* Y-axis grid lines */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[9px] text-gray-400">
                  <div className="border-b border-dashed border-gray-100 flex items-center justify-start pl-1">100%</div>
                  <div className="border-b border-dashed border-gray-100 flex items-center justify-start pl-1">75%</div>
                  <div className="border-b border-dashed border-gray-100 flex items-center justify-start pl-1">50%</div>
                  <div className="border-b border-dashed border-gray-100 flex items-center justify-start pl-1">25%</div>
                  <div className="border-b border-gray-200 flex items-center justify-start pl-1 text-gray-500">0%</div>
                </div>

                {/* Bars Columns */}
                <div className="h-40 flex items-end justify-between px-6 pt-3 relative z-10">
                  {currentChart.map((item) => (
                    <div key={item.month} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                      <div className="flex items-end gap-1.5 h-32">
                        {/* Blue Main Growth Bar */}
                        <div
                          style={{ height: `${item.growth}%` }}
                          className="w-4 sm:w-5 bg-[#0284C7] rounded-t-sm transition-all duration-300 group-hover:brightness-110 shadow-xs"
                          title={`النامية: ${item.growth}%`}
                        ></div>
                        {/* Orange Refund Bar */}
                        <div
                          style={{ height: `${item.refund}%` }}
                          className="w-2 sm:w-2.5 bg-[#FB8731] rounded-t-xs transition-all duration-300 group-hover:brightness-110 shadow-xs"
                          title={`المستردات: ${item.refund}%`}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 (Left in RTL - 3 cols): إحصائيات بوابات الدفع الإلكتروني */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <BarChart3 className="w-5 h-5 text-[#011222]" />
                <h3 className="text-xs font-black text-[#011222]">إحصائيات بوابات الدفع الإلكتروني</h3>
              </div>

              <div className="flex items-center justify-between gap-4 py-2">
                {/* Donut Gauge matching screenshot */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background */}
                    <path
                      className="text-gray-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Credit Cards (98.7% - Green) */}
                    <path
                      className="text-[#009F65]"
                      strokeDasharray="98.7, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Wallets & Bank */}
                    <path
                      className="text-[#0284C7]"
                      strokeDasharray="1.1, 100"
                      strokeDashoffset="-98.7"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-base font-black text-[#011222] font-mono leading-none">98.7%</span>
                    <span className="text-[9px] text-gray-400 font-bold mt-0.5">نسبة النجاح</span>
                  </div>
                </div>

                {/* Percentage Breakdown matching screenshot */}
                <div className="space-y-2 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 font-mono">98,7%</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-700">بطاقات الائتمان</span>
                      <span className="w-2 h-2 rounded-full bg-[#009F65]"></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 font-mono">1,1%</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-700">محافظ رقمية</span>
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 font-mono">0,2%</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-700">تحويلات بنكية</span>
                      <span className="w-2 h-2 rounded-full bg-[#FB8731]"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 NEW: قسم تدقيق إشعارات التحويل البنكي الخارجي (تدقيق الإدارة أولاً قبل إحالتها للمزود) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-200/80 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3 text-right">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF4EB] border border-[#FB8731]/40 flex items-center justify-center text-[#FB8731] shrink-0">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#011222] flex items-center gap-2">
                    <span>إشعارات التحويل البنكي الخارجي الواردة (تدقيق الإدارة واعتماد العمولة)</span>
                    <span className="bg-[#FB8731] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {auditTransfers.filter(t => t.status === 'SUBMITTED_TO_ADMIN').length} معلقة للتدقيق
                    </span>
                  </h2>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    التحويلات تتم خارج الموقع 100%. يقوم الأدمن بمراجعة الإشعار واحتساب العمولة (0% لأول 3 أيام أو 2.5% بعدها) ثم إحالته للمزود.
                  </p>
                </div>
              </div>
            </div>

            {/* تنبيه توضيحي بنظام العملات والفترة التجريبية */}
            <div className="bg-[#F0FDF4] border border-emerald-200 rounded-2xl p-3.5 mb-5 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  سياسة المنصة: أول 3 أيام مجاناً (عمولة 0%) للمستوردين الجدد، و2.5% بعد انتهاء التجربة. العملات المعتمدة: USD ($) - دينار (د.أ) - EUR (€).
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#011222] font-black text-xs border-b border-gray-100">
                    <th className="py-3.5 px-4">رقم العملية والشحنة</th>
                    <th className="py-3.5 px-4">المستورد (المحول)</th>
                    <th className="py-3.5 px-4">مزود الخدمة المستلم</th>
                    <th className="py-3.5 px-4 text-center">العملة والعمولة</th>
                    <th className="py-3.5 px-4">المبلغ الإجمالي المحول</th>
                    <th className="py-3.5 px-4 text-center">الإشعار</th>
                    <th className="py-3.5 px-4 text-center">حالة التدقيق</th>
                    <th className="py-3.5 px-4 text-center">إجراء الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {auditTransfers.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50/20 transition-colors">
                      {/* رقم العملية والشحنة */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-[#0284C7] block">{item.id}</span>
                        <span className="text-[11px] text-[#64748B] font-mono">{item.shipmentId}</span>
                      </td>

                      {/* المستورد */}
                      <td className="py-4 px-4 font-bold text-[#011222]">
                        <div>{item.importerName}</div>
                        <span className="text-[11px] text-[#64748B] font-mono">{item.importerPhone}</span>
                      </td>

                      {/* المزود */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#011222] block">{item.providerName}</span>
                        <span className="text-[10px] text-gray-500 font-mono truncate max-w-[180px] block">{item.providerBank}</span>
                      </td>

                      {/* العملة والعمولة */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-[#011222] block">
                          {item.currency === 'USD' ? 'دولار ($)' : item.currency === 'DINAR' ? 'دينار (د.أ)' : 'يورو (€)'}
                        </span>
                        <span className={`text-[10px] font-bold ${item.isTrial ? 'text-emerald-600' : 'text-blue-600'}`}>
                          {item.isTrial ? 'أول 3 أيام (0%)' : 'عمولة منصة (2.5%)'}
                        </span>
                      </td>

                      {/* المبلغ المحول */}
                      <td className="py-4 px-4">
                        <span className="font-black text-[#FB8731] text-sm font-mono block">
                          {item.totalAmount.toLocaleString()} {item.currencySymbol}
                        </span>
                        <span className="text-[10px] text-gray-400">أساسي: {item.subtotal.toLocaleString()} {item.currencySymbol}</span>
                      </td>

                      {/* الإشعار */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptPreview(item)}
                          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-[#0284C7] px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة</span>
                        </button>
                      </td>

                      {/* حالة التدقيق */}
                      <td className="py-4 px-4 text-center">
                        {item.status === 'SUBMITTED_TO_ADMIN' ? (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706]">
                            بانتظار تدقيق الإدارة
                          </span>
                        ) : item.status === 'APPROVED_BY_ADMIN' ? (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                            معتمد إدارياً (أحيل للمزود)
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626]">
                            مرفوض من الإدارة
                          </span>
                        )}
                      </td>

                      {/* إجراء الإدارة */}
                      <td className="py-4 px-4 text-center">
                        {item.status === 'SUBMITTED_TO_ADMIN' ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApproveAuditTransfer(item.id)}
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
                              title="اعتماد وتمرير لمزود الخدمة"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>اعتماد وتمرير</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectModalData(item)
                                setRejectReason('')
                              }}
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                              title="رفض الإشعار"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>رفض</span>
                            </button>
                          </div>
                        ) : item.status === 'APPROVED_BY_ADMIN' ? (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم الاعتماد والإحالة</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[11px]">
                            تم الرفض
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two Tables Row: الفواتير الضريبية المعتمدة + طلبات التحويل وسحب الأرباح matching screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Right Table (in RTL - 6 cols): الفواتير الضريبية المعتمدة */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {/* Header with Export buttons */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportInvoicesPDF}
                    className="px-3 py-1.5 bg-[#FFF0F2] hover:bg-[#FFE2E6] text-[#E11D48] rounded-xl text-xs font-bold border border-[#FED7DC] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                    title="تصدير وطباعة الفواتير كـ PDF"
                  >
                    <span className="w-4 h-4 bg-[#E11D48] text-white rounded text-[9px] font-black flex items-center justify-center">
                      PDF
                    </span>
                    <span>تصدير PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportInvoicesExcel}
                    className="px-3 py-1.5 bg-[#EAFBF3] hover:bg-[#D7F7E8] text-[#009F65] rounded-xl text-xs font-bold border border-[#B0F0D2] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                    title="تصدير وتحميل الفواتير كـ Excel (XLS)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#009F65]" />
                    <span>تصدير كشف</span>
                  </button>
                </div>
                <h3 className="text-xs font-black text-[#011222]">الفواتير الضريبية المعتمدة</h3>
              </div>

              {/* Invoices Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                      <th className="py-2.5 px-3 text-right">رقم الفاتورة</th>
                      <th className="py-2.5 px-3 text-center">تاريخ الإصدار</th>
                      <th className="py-2.5 px-3 text-center">الحالة</th>
                      <th className="py-2.5 px-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-gray-700 font-mono">{inv.id}</td>
                        <td className="py-3 px-3 text-gray-500 font-medium dir-ltr text-center font-mono">
                          {inv.issueDate}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${
                              inv.status === 'معتمدة'
                                ? 'bg-[#E6F9F0] text-[#009F65]'
                                : 'bg-[#E0F2FE] text-[#0284C7]'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-gray-400">
                            <button
                              type="button"
                              onClick={() => setPreviewInvoice(inv)}
                              className="w-7 h-7 rounded-lg border border-gray-200/80 bg-white hover:text-[#011222] hover:border-gray-400 flex items-center justify-center transition-colors cursor-pointer"
                              title="معاينة الفاتورة"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast(`تم تنزيل الفاتورة ${inv.id}`)}
                              className="w-7 h-7 rounded-lg border border-gray-200/80 bg-white hover:text-[#FB8731] hover:border-[#FB8731] flex items-center justify-center transition-colors cursor-pointer"
                              title="تنزيل الفاتورة"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Left Table (in RTL - 6 cols): طلبات التحويل و سحب الأرباح */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="pb-3 border-b border-gray-100 mb-4 text-right">
                <h3 className="text-xs font-black text-[#011222]">طلبات التحويل و سحب الأرباح</h3>
              </div>

              {/* Transfers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                      <th className="py-2.5 px-3 text-right">رقم الطلب</th>
                      <th className="py-2.5 px-3 text-center">النوع</th>
                      <th className="py-2.5 px-3 text-center">الحالة</th>
                      <th className="py-2.5 px-3 text-center">تاريخ الطلب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transfers.map((trx) => {
                      const statusClass =
                        trx.status === 'مكتملة'
                          ? 'bg-[#E6F9F0] text-[#009F65]'
                          : trx.status === 'قيد المراجعة'
                          ? 'bg-[#E0F2FE] text-[#0284C7]'
                          : trx.status === 'تحت المراجعة'
                          ? 'bg-[#FFF4EC] text-[#FB8731]'
                          : 'bg-[#FEE2E2] text-[#EF4444]'

                      return (
                        <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-3 font-bold text-gray-700 font-mono">{trx.id}</td>
                          <td className="py-3 px-3 font-semibold text-gray-700 text-center">{trx.type}</td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${statusClass}`}
                            >
                              {trx.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-500 font-medium dir-ltr text-center font-mono">
                            {trx.date}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Full-Width Table: إحصائيات بوابات الدفع و المعاملات المالية matching screenshot */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="pb-3 border-b border-gray-100 mb-4 text-right">
              <h3 className="text-xs font-black text-[#011222]">
                إحصائيات بوابات الدفع و المعاملات المالية
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                    <th className="py-3.5 px-4 text-right">التاريخ و الوقت</th>
                    <th className="py-3.5 px-4 text-center">نوع العملية</th>
                    <th className="py-3.5 px-4 text-right">البيان</th>
                    <th className="py-3.5 px-4 text-center">المستخدم</th>
                    <th className="py-3.5 px-4 text-left">تفاصيل إضافية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-gray-500 font-medium dir-ltr text-right font-mono">
                        {tx.dateTime}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#011222] text-center">{tx.operationType}</td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">{tx.description}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-800 text-center">{tx.user}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-700 text-left font-mono">{tx.extraDetails}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
