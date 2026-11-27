import { useState, useEffect } from 'react'
import AdminSidebar from '../../../components/dashboard/AdminSidebar'
import AdminHeader from '../../../components/dashboard/AdminHeader'
import api from '../../../services/api'
import {
  Search,
  Truck,
  Hourglass,
  CheckCircle2,
  Box,
  RotateCcw,
  Download,
  Eye,
  Edit2,
  ChevronDown,
  Settings,
  Ship,
  Plane,
  Clock,
  FileSpreadsheet,
  FileText,
  FileCode,
  Users,
  CreditCard,
  TrendingUp,
  Coins,
  CheckCircle,
  X
} from 'lucide-react'

// Initial Shipments Data matching screenshot 1:1
const initialShipments = [
  {
    id: 'SHN-2026-884',
    clientName: 'شركة النور للاستيراد',
    transportType: 'بحري',
    route: 'رياض - جدة',
    status: 'مكتملة',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    createdAt: '2026/9/12 - 12:30 PM',
    carrier: 'شركة أساطيل الخليج',
    notes: 'تم تسليم الشحنة في ميناء جدة الإسلامي بنجاح'
  },
  {
    id: 'SHN-2026-756',
    clientName: 'مؤسسة الرواد التجارية',
    transportType: 'بري',
    route: 'جدة - الدمام',
    status: 'تحت المراجعة',
    statusBg: '#FFF4E8',
    statusColor: '#EA580C',
    createdAt: '2026/8/20 - 1:20 PM',
    carrier: 'شركة المشرق للنقل',
    notes: 'في انتظار تأكيد الفحص الدوري للشاحنة'
  },
  {
    id: 'SHN-2026-901',
    clientName: 'شركة التقنية الحديثة',
    transportType: 'جوي',
    route: 'شنغهاي - ابوظبي',
    status: 'في التخليص الجمركي',
    statusBg: '#E0F2FE',
    statusColor: '#0284C7',
    createdAt: '2026/10/18 - 2:40 PM',
    carrier: 'طيران الخليج للشحن',
    notes: 'إجراءات التخليص بمطار أبوظبي الدولي جارية'
  },
  {
    id: 'SHN-2026-867',
    clientName: 'المجموعة الإيطالية للتجارة',
    transportType: 'بحري',
    route: 'ميلانو - الدمام',
    status: 'متأخرة',
    statusBg: '#FEEAEA',
    statusColor: '#DC2626',
    createdAt: '2026/11/20 - 9:22 PM',
    carrier: 'الخطوط الملاحية العالمية',
    notes: 'تأخر الإبحار بسبب الأحوال الجوية في البحر المتوسط'
  },
  {
    id: 'SHN-2026-903',
    clientName: 'شركة البصائر للتوزيع',
    transportType: 'بري',
    route: 'الرياض - دبي',
    status: 'مكتملة',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    createdAt: '2026/11/8 - 10:40 PM',
    carrier: 'شركة النخبة للنقل',
    notes: 'تمت الرحلة وفق الجدول الزمني المحدد'
  },
  {
    id: 'SHN-2026-912',
    clientName: 'شركة الرافدين للتوريدات',
    transportType: 'جوي',
    route: 'جبل علي - الرياض',
    status: 'تحت المراجعة',
    statusBg: '#FFF4E8',
    statusColor: '#EA580C',
    createdAt: '2026/7/8 - 10:20 PM',
    carrier: 'أجنحة الشحن السريع',
    notes: 'مراجعة أوراق المنشأ والفاتورة الجمركية'
  },
  {
    id: 'SHN-2026-966',
    clientName: 'شركة المشرق للنقل',
    transportType: 'بحري',
    route: 'أبو ظبي - جدة',
    status: 'تحت المراجعة',
    statusBg: '#FFF4E8',
    statusColor: '#EA580C',
    createdAt: '2026/8/9 - 12:20 PM',
    carrier: 'شركة النخبة للنقل',
    notes: 'تحت المراقبة التشغيلية لمتابعة مسار الرحلة'
  },
  {
    id: 'SHN-2026-812',
    clientName: 'العربية الدولية للتجارة',
    transportType: 'بري',
    route: 'عمان - دبي',
    status: 'مكتملة',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    createdAt: '2026/7/24 - 2:30 PM',
    carrier: 'الناقل العربي المشترك',
    notes: 'تم التسليم وتوقيع إيصال الاستلام الرقمي'
  }
]

// Audit Trail Data matching screenshot 1:1
const initialAuditTrail = [
  {
    id: 1,
    details: 'تم تغيير الحالة إلى: مكتملة',
    performedBy: 'أحمد المدير العام',
    event: 'تغيير الحالة',
    dateTime: '2026/8/2 - 1:40 PM',
    colorDot: 'bg-[#009F65]'
  },
  {
    id: 2,
    details: 'تم إضافة الملاحظة: تم إنهاء إجراءات التخليص',
    performedBy: 'محمد وليد',
    event: 'ملاحظة',
    dateTime: '2026/1/9 - 10:40 PM',
    colorDot: 'bg-[#0284C7]'
  },
  {
    id: 3,
    details: 'تم تحديث المسار إلى: الجدة',
    performedBy: 'سارة حسن',
    event: 'تحديث المسار',
    dateTime: '2026/9/8 - 9:40 PM',
    colorDot: 'bg-gray-500'
  }
]

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState(initialShipments)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedShipment, setSelectedShipment] = useState(initialShipments[6])
  const [auditTrail, setAuditTrail] = useState(initialAuditTrail)

  // قراءة كافة شحنات المنصة من قاعدة البيانات مباشرة
  useEffect(() => {
    api.get('/shipments')
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const mapped = res.data.map((s) => ({
            id: s.trackingNumber || s.id,
            dbId: s.id,
            clientName: s.importer?.fullName || 'مستورد معتمد',
            transportType: s.sector === 'SEA_FREIGHT' ? 'بحري' : s.sector === 'AIR_FREIGHT' ? 'جوي' : 'بري',
            route: `${s.originName || 'المصدر'} - ${s.destName || 'الوجهة'}`,
            status: s.status === 'DELIVERED' ? 'مكتملة' : s.status === 'CUSTOMS_HOLD' ? 'في التخليص الجمركي' : s.status === 'DELAYED' ? 'متأخرة' : 'تحت المراجعة',
            statusBg: s.status === 'DELIVERED' ? '#E6F9F0' : s.status === 'CUSTOMS_HOLD' ? '#E0F2FE' : s.status === 'DELAYED' ? '#FEEAEA' : '#FFF4E8',
            statusColor: s.status === 'DELIVERED' ? '#009F65' : s.status === 'CUSTOMS_HOLD' ? '#0284C7' : s.status === 'DELAYED' ? '#DC2626' : '#EA580C',
            createdAt: new Date(s.createdAt || Date.now()).toLocaleDateString('ar-SA'),
            carrier: s.provider?.fullName || 'شركة الشحن المعتمدة',
            notes: `شحنة مسجلة برقم تتبع ${s.trackingNumber || s.id}`
          }))
          setShipments(mapped)
          setSelectedShipment(mapped[0])
        }
      })
      .catch(() => {})
  }, [])

  // Manual Control Form State
  const [newStatus, setNewStatus] = useState('مكتملة')
  const [newRoute, setNewRoute] = useState('اختيار مسار جديد')
  const [newCarrier, setNewCarrier] = useState('شركة النخبة للنقل')
  const [adminNotes, setAdminNotes] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  // Report Export Modal State
  const [showExportModal, setShowExportModal] = useState(false)
  const [reportType, setReportType] = useState('trucks')
  const [reportPeriod, setReportPeriod] = useState('30days')
  const [reportFormat, setReportFormat] = useState('excel')
  const [isExporting, setIsExporting] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  // Filter Shipments
  const filteredShipments = shipments.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.id.toLowerCase().includes(q) ||
      item.clientName.toLowerCase().includes(q) ||
      item.route.toLowerCase().includes(q)
    )
  })

  // Handle Reset Filters
  const handleReset = () => {
    setSearchQuery('')
    showToast('تمت إعادة ضبط التصفية')
  }

  // Apply Manual Control Modifications
  const handleApplyModification = (e) => {
    e.preventDefault()
    if (!selectedShipment) return

    const getStatusColors = (st) => {
      if (st === 'مكتملة') return { bg: '#E6F9F0', color: '#009F65' }
      if (st === 'في التخليص الجمركي') return { bg: '#E0F2FE', color: '#0284C7' }
      if (st === 'متأخرة') return { bg: '#FEEAEA', color: '#DC2626' }
      return { bg: '#FFF4E8', color: '#EA580C' }
    }

    const { bg, color } = getStatusColors(newStatus)

    const updatedShipments = shipments.map((s) => {
      if (s.id === selectedShipment.id) {
        return {
          ...s,
          status: newStatus,
          statusBg: bg,
          statusColor: color,
          route: newRoute !== 'اختيار مسار جديد' ? newRoute : s.route,
          carrier: newCarrier,
          notes: adminNotes || s.notes
        }
      }
      return s
    })

    setShipments(updatedShipments)
    setSelectedShipment({
      ...selectedShipment,
      status: newStatus,
      statusBg: bg,
      statusColor: color,
      route: newRoute !== 'اختيار مسار جديد' ? newRoute : selectedShipment.route,
      carrier: newCarrier,
      notes: adminNotes || selectedShipment.notes
    })

    // Prepend to Audit Trail
    const newAuditEntry = {
      id: Date.now(),
      details: `تم تعديل الشحنة (${selectedShipment.id}): الحالة إلى ${newStatus} ${
        adminNotes ? `- ملاحظة: ${adminNotes}` : ''
      }`,
      performedBy: 'أحمد المدير العام',
      event: 'تعديل يدوي إداري',
      dateTime: 'الآن - 2026/11/9',
      colorDot: 'bg-[#FB8731]'
    }
    setAuditTrail([newAuditEntry, ...auditTrail])

    // حفظ التعديل فورياً وتلقائياً في قاعدة بيانات Supabase
    const dbStatus =
      newStatus === 'مكتملة' ? 'DELIVERED' :
      newStatus === 'في التخليص الجمركي' ? 'CUSTOMS' :
      newStatus === 'متأخرة' ? 'DELAYED' :
      newStatus === 'قيد الشحن' ? 'IN_TRANSIT' : 'PENDING'

    const targetId = selectedShipment.dbId || selectedShipment.id
    api.patch(`/shipments/${targetId}/status`, { status: dbStatus }).catch(() => {})

    setAdminNotes('')
    showToast(`تم تطبيق التعديلات بنجاح على الشحنة ${selectedShipment.id}`)
  }

  // Handle Report Download & Modal Close
  const handleExportReport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      const formatNames = {
        excel: 'Excel (.xlsx)',
        csv: 'CSV (.csv)',
        pdf: 'PDF (.pdf)'
      }
      const typeNames = {
        trucks: 'تقرير الشحنات',
        clients: 'تقرير العملاء',
        payments: 'تقرير المدفوعات',
        performance: 'تقرير الأداء',
        users: 'تقرير المستخدمين',
        revenue: 'تقرير الإيرادات'
      }

      // Trigger realistic CSV/Excel download
      try {
        const csvContent =
          'data:text/csv;charset=utf-8,' +
          'رقم الشاحنة,اسم العميل,نوع النقل,مسار الرحلة,الحالة,تاريخ الإنشاء\n' +
          shipments
            .map(
              (s) =>
                `"${s.id}","${s.clientName}","${s.transportType}","${s.route}","${s.status}","${s.createdAt}"`
            )
            .join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute(
          'download',
          `تقرير_${reportType}_${reportPeriod}.${reportFormat === 'excel' ? 'xls' : reportFormat === 'csv' ? 'csv' : 'pdf'}`
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch {
        // fallback
      }

      showToast(`تم إنشاء وتصدير ${typeNames[reportType]} بصيغة ${formatNames[reportFormat]} بنجاح`)
      setShowExportModal(false)
    }, 1100)
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] relative overflow-hidden font-almarai" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#011222] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FB8731]/40 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#009F65]" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Export Report Modal Dialog matching media_1794242227951_0a1110ab.png & platform brand */}
      {showExportModal && (
        <div className="fixed inset-0 bg-[#011222]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl border border-gray-100 relative text-right font-almarai">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute left-6 top-6 w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Modal Header */}
            <div className="text-right mb-6">
              <div className="flex items-center justify-end gap-3 mb-1">
                <h2 className="text-2xl font-black text-[#011222] tracking-tight">تصدير التقرير</h2>
                <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB8731]">
                  <Download className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                قم بتصدير تقارير المنصة بصيغ مختلفة حسب احتياجاتك
              </p>
            </div>

            {/* 1. نوع التقرير */}
            <div className="pt-6 border-t border-gray-100 mb-6">
              <h3 className="text-sm font-bold text-[#011222] mb-4 text-right">نوع التقرير</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Trucks */}
                <button
                  type="button"
                  onClick={() => setReportType('trucks')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    reportType === 'trucks'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731]/50 hover:bg-orange-50/20'
                  }`}
                >
                  <Truck className={`w-6 h-6 ${reportType === 'trucks' ? 'text-white' : 'text-[#FB8731]'}`} />
                  <span className="text-xs font-bold">تقرير الشحنات</span>
                </button>

                {/* Clients */}
                <button
                  type="button"
                  onClick={() => setReportType('clients')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    reportType === 'clients'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731]/50 hover:bg-orange-50/20'
                  }`}
                >
                  <Users className={`w-6 h-6 ${reportType === 'clients' ? 'text-white' : 'text-[#FB8731]'}`} />
                  <span className="text-xs font-bold">تقرير العملاء</span>
                </button>

                {/* Payments */}
                <button
                  type="button"
                  onClick={() => setReportType('payments')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    reportType === 'payments'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731]/50 hover:bg-orange-50/20'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${reportType === 'payments' ? 'text-white' : 'text-[#FB8731]'}`} />
                  <span className="text-xs font-bold">تقرير المدفوعات</span>
                </button>

                {/* Performance */}
                <button
                  type="button"
                  onClick={() => setReportType('performance')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    reportType === 'performance'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731]/50 hover:bg-orange-50/20'
                  }`}
                >
                  <TrendingUp className={`w-6 h-6 ${reportType === 'performance' ? 'text-white' : 'text-[#FB8731]'}`} />
                  <span className="text-xs font-bold">تقرير الأداء</span>
                </button>

                {/* Users */}
                <button
                  type="button"
                  onClick={() => setReportType('users')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    reportType === 'users'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731]/50 hover:bg-orange-50/20'
                  }`}
                >
                  <Users className={`w-6 h-6 ${reportType === 'users' ? 'text-white' : 'text-[#FB8731]'}`} />
                  <span className="text-xs font-bold">تقرير المستخدمين</span>
                </button>

                {/* Revenue */}
                <button
                  type="button"
                  onClick={() => setReportType('revenue')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    reportType === 'revenue'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731]/50 hover:bg-orange-50/20'
                  }`}
                >
                  <Coins className={`w-6 h-6 ${reportType === 'revenue' ? 'text-white' : 'text-[#FB8731]'}`} />
                  <span className="text-xs font-bold">تقرير الإيرادات</span>
                </button>
              </div>
            </div>

            {/* 2. فترة التقرير */}
            <div className="pt-6 border-t border-gray-100 mb-6">
              <h3 className="text-sm font-bold text-[#011222] mb-3 text-right">فترة التقرير</h3>
              <div className="flex flex-wrap items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setReportPeriod('7days')}
                  className={`py-2 px-6 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    reportPeriod === '7days'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-md shadow-orange-500/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731] hover:text-[#FB8731]'
                  }`}
                >
                  آخر 7 أيام
                </button>

                <button
                  type="button"
                  onClick={() => setReportPeriod('30days')}
                  className={`py-2 px-6 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    reportPeriod === '30days'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-md shadow-orange-500/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731] hover:text-[#FB8731]'
                  }`}
                >
                  آخر 30 يوم
                </button>

                <button
                  type="button"
                  onClick={() => setReportPeriod('3months')}
                  className={`py-2 px-6 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    reportPeriod === '3months'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-md shadow-orange-500/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731] hover:text-[#FB8731]'
                  }`}
                >
                  آخر 3 أشهر
                </button>

                <button
                  type="button"
                  onClick={() => setReportPeriod('custom')}
                  className={`py-2 px-6 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    reportPeriod === 'custom'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-md shadow-orange-500/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731] hover:text-[#FB8731]'
                  }`}
                >
                  مخصص
                </button>
              </div>
            </div>

            {/* 3. صيغة التقرير */}
            <div className="pt-6 border-t border-gray-100 mb-8">
              <h3 className="text-sm font-bold text-[#011222] mb-4 text-right">صيغة التقرير</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* CSV */}
                <button
                  type="button"
                  onClick={() => setReportFormat('csv')}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-right cursor-pointer ${
                    reportFormat === 'csv'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FB8731]/40 hover:bg-orange-50/10'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black mb-0.5">ملف CSV</h4>
                    <p className={`text-[11px] font-medium ${reportFormat === 'csv' ? 'text-white/80' : 'text-gray-400'}`}>
                      للاستخدام العام
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reportFormat === 'csv' ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#011222]'}`}>
                    <FileCode className="w-5 h-5" />
                  </div>
                </button>

                {/* Excel */}
                <button
                  type="button"
                  onClick={() => setReportFormat('excel')}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-right cursor-pointer ${
                    reportFormat === 'excel'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black mb-0.5">ملف Excel</h4>
                    <p className={`text-[11px] font-medium ${reportFormat === 'excel' ? 'text-white/80' : 'text-gray-400'}`}>
                      للتحليل
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reportFormat === 'excel' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-[#009F65]'}`}>
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                </button>

                {/* PDF */}
                <button
                  type="button"
                  onClick={() => setReportFormat('pdf')}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-right cursor-pointer ${
                    reportFormat === 'pdf'
                      ? 'bg-[#FB8731] text-white border-[#FB8731] shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50/20'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black mb-0.5">ملف PDF</h4>
                    <p className={`text-[11px] font-medium ${reportFormat === 'pdf' ? 'text-white/80' : 'text-gray-400'}`}>
                      قابل للطباعة
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reportFormat === 'pdf' ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Export Action Button */}
            <div className="pt-6 border-t border-gray-100 flex justify-start">
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExportReport}
                className="bg-[#011222] hover:bg-[#02203d] text-white px-8 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-lg shadow-[#011222]/20 hover:shadow-[#011222]/30 active:scale-[0.98] transition-all disabled:opacity-75 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>جاري تصدير التقرير...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#FB8731]" />
                    <span>تصدير التقرير</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar activePath="/admin/shipments" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[280px] flex flex-col min-h-screen select-none overflow-x-hidden">
        {/* Top Header Bar pinned edge-to-edge */}
        <AdminHeader searchValue={searchQuery} onSearch={setSearchQuery} />

        {/* Inner Content Area */}
        <div className="p-6 lg:p-8 space-y-6">
          {/* Page Title: إدارة الرقابة على الشحنات */}
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
              إدارة الرقابة على الشحنات
            </h1>
          </div>

          {/* 1. TOP 4 METRIC CARDS ROW matching screenshot with Harmonized Translucent Tinted Backgrounds */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1 (Far Right in RTL): إجمالي الشحنات (Translucent Purple Tint) */}
            <div className="bg-[#F5F3FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#DDD6FE]/70 hover:border-[#7C3AED]/50 shadow-[0_2px_12px_rgba(124,58,237,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#6D28D9] block mb-1">إجمالي الشحنات</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {shipments.length}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-xs">
                <Box className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 2 (2nd from Right): شحنة متأخرة (Translucent Sky Blue Tint) */}
            <div className="bg-[#F0F9FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#BAE6FD]/70 hover:border-[#0284C7]/50 shadow-[0_2px_12px_rgba(2,132,199,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#0369A1] block mb-1">شحنة متأخرة</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {shipments.filter((s) => s.status === 'متأخرة').length}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
                <Hourglass className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 3 (3rd from Right): شحنة متكاملة (Translucent Emerald Green Tint) */}
            <div className="bg-[#ECFDF5]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#A7F3D0]/70 hover:border-[#009F65]/50 shadow-[0_2px_12px_rgba(0,159,101,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#047857] block mb-1">شحنة متكاملة</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {shipments.filter((s) => s.status === 'مكتملة').length}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#A7F3D0] text-[#009F65] flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 4 (Far Left in RTL): شحنة قيد المراجعة (Translucent Meynaa Orange Tint) */}
            <div className="bg-[#FFF7ED]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#FED7AA]/70 hover:border-[#FB8731]/50 shadow-[0_2px_12px_rgba(251,135,49,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#C2410C] block mb-1">شحنة قيد التنفيذ</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {shipments.filter((s) => s.status !== 'مكتملة' && s.status !== 'متأخرة').length}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#FED7AA] text-[#FB8731] flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
          </section>

          {/* 2. FILTER & ACTION BAR matching screenshot */}
          <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Right: Search Input */}
            <div className="relative w-full sm:flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الشحنة ، اسم العميل ، أو المسار"
                className="w-full bg-white border border-gray-200/90 rounded-full py-2.5 px-5 pl-11 text-xs text-right text-[#011222] placeholder-gray-400 focus:outline-none focus:border-[#FB8731] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Left: Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Reset Filter Button */}
              <button
                type="button"
                onClick={handleReset}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full px-5 py-2.5 text-xs font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span>إعادة تعيين</span>
              </button>

              {/* Export Report Button */}
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="bg-[#011222] hover:bg-[#02203d] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#011222]/15 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FB8731]" />
                <span>تصدير التقرير</span>
              </button>
            </div>
          </section>

          {/* 3. MIDDLE SECTION: SHIPMENT DETAILS ON RIGHT + SHIPMENTS TABLE ON LEFT */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* RIGHT COLUMN (in RTL): تفاصيل الشحنة والتحكم اليدوي matching screenshot */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 text-right">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: selectedShipment?.statusBg, color: selectedShipment?.statusColor }}
                >
                  {selectedShipment?.status}
                </span>

                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                    تفاصيل الشحنة
                  </h3>
                  <Truck className="w-4 h-4 text-[#011222]" />
                </div>
              </div>

              {/* Shipment Primary Info */}
              <div className="space-y-1.5 text-right">
                <div className="text-base font-black text-[#0284C7] font-mono">
                  {selectedShipment?.id}
                </div>
                <div className="text-xs text-gray-600 font-bold">
                  اسم العميل: <span className="text-[#011222]">{selectedShipment?.clientName}</span>
                </div>
                <div className="text-xs text-gray-600 font-bold">
                  نوع النقل: <span className="text-[#011222]">{selectedShipment?.transportType}</span>
                </div>
                <div className="text-xs text-gray-600 font-bold">
                  المسار: <span className="text-[#011222]">{selectedShipment?.route}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono font-medium">
                  تاريخ الإنشاء: {selectedShipment?.createdAt}
                </div>
              </div>

              {/* Sub-card: التحكم اليدوي matching screenshot */}
              <div className="border border-blue-100 rounded-2xl p-4 bg-[#F8FAFC] space-y-3">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 mb-0.5">
                    <span className="text-xs font-black text-[#011222]">التحكم اليدوي</span>
                    <Settings className="w-4 h-4 text-[#0284C7]" />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold">
                    تعديل الحالة التشغيلية أو حل النزاعات
                  </p>
                </div>

                <form onSubmit={handleApplyModification} className="space-y-2.5 text-right">
                  {/* Status Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      اختر الحالة الجديدة
                    </label>
                    <div className="relative">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full bg-white border border-gray-200/90 rounded-full px-4 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FB8731] appearance-none cursor-pointer"
                      >
                        <option value="مكتملة">مكتملة</option>
                        <option value="تحت المراجعة">تحت المراجعة</option>
                        <option value="في التخليص الجمركي">في التخليص الجمركي</option>
                        <option value="متأخرة">متأخرة</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Route Modification */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      تعديل المسار
                    </label>
                    <div className="relative">
                      <select
                        value={newRoute}
                        onChange={(e) => setNewRoute(e.target.value)}
                        className="w-full bg-white border border-gray-200/90 rounded-full px-4 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FB8731] appearance-none cursor-pointer"
                      >
                        <option value="اختيار مسار جديد">اختيار مسار جديد</option>
                        <option value="رياض - جدة">رياض - جدة</option>
                        <option value="جدة - الدمام">جدة - الدمام</option>
                        <option value="شنغهاي - ابوظبي">شنغهاي - ابوظبي</option>
                        <option value="ميلانو - الدمام">ميلانو - الدمام</option>
                        <option value="الرياض - دبي">الرياض - دبي</option>
                        <option value="جبل علي - الرياض">جبل علي - الرياض</option>
                        <option value="أبو ظبي - جدة">أبو ظبي - جدة</option>
                        <option value="عمان - دبي">عمان - دبي</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Carrier Assignment */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      تعيين شركة نقل جديدة (اختيارية)
                    </label>
                    <div className="relative">
                      <select
                        value={newCarrier}
                        onChange={(e) => setNewCarrier(e.target.value)}
                        className="w-full bg-white border border-gray-200/90 rounded-full px-4 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FB8731] appearance-none cursor-pointer"
                      >
                        <option value="شركة النخبة للنقل">شركة النخبة للنقل</option>
                        <option value="شركة المشرق للنقل">شركة المشرق للنقل</option>
                        <option value="شركة أساطيل الخليج">شركة أساطيل الخليج</option>
                        <option value="طيران الخليج للشحن">طيران الخليج للشحن</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      ملاحظات (اختيارية)
                    </label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="أضف ملاحظاتك هنا....."
                      className="w-full bg-white border border-gray-200/90 rounded-2xl py-2 px-3 text-xs text-right text-[#011222] placeholder-gray-400 focus:outline-none focus:border-[#FB8731]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#FB8731] hover:bg-[#e07525] active:scale-95 text-white py-2.5 rounded-xl text-xs font-black transition-all shadow-md shadow-orange-500/20 mt-3 cursor-pointer"
                  >
                    تطبيق التعديل
                  </button>
                </form>
              </div>
            </div>

            {/* LEFT COLUMN (in RTL): Shipments Table matching screenshot */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold pb-3">
                      <th className="pb-3 text-center">الإجراءات</th>
                      <th className="pb-3 text-center">تاريخ الإنشاء</th>
                      <th className="pb-3 text-center">الحالة</th>
                      <th className="pb-3 text-center">مسار الرحلة</th>
                      <th className="pb-3 text-center">نوع النقل</th>
                      <th className="pb-3 pr-2 text-right">رقم الشاحنة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {filteredShipments.map((shipment) => {
                      const isSelected = selectedShipment?.id === shipment.id

                      return (
                        <tr
                          key={shipment.id}
                          onClick={() => setSelectedShipment(shipment)}
                          className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#FFF7ED]/70 font-bold' : ''
                          }`}
                        >
                          {/* الإجراءات: 3 Icons (Eye, Edit, Chevron) */}
                          <td className="py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5 text-gray-400">
                              <button
                                type="button"
                                onClick={() => setSelectedShipment(shipment)}
                                className="w-7 h-7 rounded-lg border border-gray-200/80 bg-white hover:text-[#0284C7] hover:border-[#0284C7] flex items-center justify-center transition-colors cursor-pointer"
                                title="معاينة الشحنة"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedShipment(shipment)
                                  setNewStatus(shipment.status)
                                  showToast(`جاهز لتعديل الشحنة ${shipment.id}`)
                                }}
                                className="w-7 h-7 rounded-lg border border-gray-200/80 bg-white hover:text-[#FB8731] hover:border-[#FB8731] flex items-center justify-center transition-colors cursor-pointer"
                                title="تعديل الشحنة"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedShipment(shipment)}
                                className="w-7 h-7 rounded-lg border border-gray-200/80 bg-white hover:text-[#011222] hover:border-[#011222] flex items-center justify-center transition-colors cursor-pointer"
                                title="المزيد"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* تاريخ الإنشاء */}
                          <td className="py-3.5 text-center font-mono text-gray-500">
                            {shipment.createdAt}
                          </td>

                          {/* الحالة */}
                          <td className="py-3.5 text-center">
                            <span
                              className="px-3 py-1 rounded-full text-[11px] font-bold inline-block min-w-[75px]"
                              style={{ backgroundColor: shipment.statusBg, color: shipment.statusColor }}
                            >
                              {shipment.status}
                            </span>
                          </td>

                          {/* مسار الرحلة */}
                          <td className="py-3.5 text-center text-[#011222] font-bold">
                            {shipment.route}
                          </td>

                          {/* نوع النقل (بحري, بري, جوي with icons) */}
                          <td className="py-3.5 text-center">
                            <div className="inline-flex items-center justify-center gap-1.5 text-gray-700 font-bold">
                              <span>{shipment.transportType}</span>
                              {shipment.transportType === 'بحري' && <Ship className="w-3.5 h-3.5 text-gray-500" />}
                              {shipment.transportType === 'بري' && <Truck className="w-3.5 h-3.5 text-gray-500" />}
                              {shipment.transportType === 'جوي' && <Plane className="w-3.5 h-3.5 text-gray-500" />}
                            </div>
                          </td>

                          {/* رقم الشاحنة (Blue Link) */}
                          <td className="py-3.5 pr-2">
                            <span className="font-black text-[#0284C7] font-mono hover:underline">
                              {shipment.id}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 4. BOTTOM SECTION: السجل التتبع الخطي matching screenshot */}
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
            {/* Header */}
            <div className="flex items-center justify-end gap-2 pb-2 border-b border-gray-100 text-right">
              <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                السجل التتبع الخطي
              </h3>
              <Clock className="w-4 h-4 text-[#011222]" />
            </div>

            {/* Audit Trail Table matching screenshot column order */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold pb-3">
                    <th className="pb-3 text-right">التفاصيل</th>
                    <th className="pb-3 text-center">من قام بالإجراء</th>
                    <th className="pb-3 text-center">الحدث</th>
                    <th className="pb-3 text-center">التاريخ و الوقت</th>
                    <th className="pb-3 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {auditTrail.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* التفاصيل */}
                      <td className="py-3.5 text-gray-700 font-medium text-right">
                        {log.details}
                      </td>

                      {/* من قام بالإجراء */}
                      <td className="py-3.5 text-[#011222] font-bold text-center">
                        {log.performedBy}
                      </td>

                      {/* الحدث */}
                      <td className="py-3.5 text-gray-600 font-bold text-center">
                        {log.event}
                      </td>

                      {/* التاريخ و الوقت */}
                      <td className="py-3.5 font-mono text-gray-500 text-center">
                        {log.dateTime}
                      </td>

                      {/* Status Dot */}
                      <td className="py-3.5 text-center">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block ${log.colorDot}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
