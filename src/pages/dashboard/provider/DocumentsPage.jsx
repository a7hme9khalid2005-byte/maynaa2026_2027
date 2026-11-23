import { useState, useRef } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'
import DashboardHeader from '../../../components/dashboard/DashboardHeader'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import DocumentPreviewModal from '../../../components/modals/DocumentPreviewModal'
import { downloadShippingDocument } from '../../../utils/documentDownloader'
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Search,
  X,
  AlertCircle
} from 'lucide-react'

const initialDocs = [
  {
    id: 'DOC-001',
    name: 'بوليصة الشحن البحرية',
    type: 'B\\L',
    refNo: 'BL-MSK-9941',
    shipment: 'SHN-2026-884',
    date: '2026-08-25',
    size: '1.2 MB',
    status: 'مُعتمد',
    statusBg: '#D0FAE4',
    statusColor: '#009F65',
  },
  {
    id: 'DOC-002',
    name: 'شهادة المنشأ - هامبورغ',
    type: 'COO',
    refNo: 'COO-DE-8821',
    shipment: 'SHN-2026-884',
    date: '2026-08-24',
    size: '0.8 MB',
    status: 'مُعتمد',
    statusBg: '#D0FAE4',
    statusColor: '#009F65',
  },
  {
    id: 'DOC-003',
    name: 'فاتورة التصدير التجارية',
    type: 'Invoice',
    refNo: 'INV-2026-441',
    shipment: 'SHN-2026-884',
    date: '2026-08-23',
    size: '2.1 MB',
    status: 'قيد المراجعة',
    statusBg: '#FEEBDF',
    statusColor: '#FB8731',
  },
  {
    id: 'DOC-004',
    name: 'قائمة التعبئة والتغليف',
    type: 'Packing List',
    refNo: 'PKL-901-88',
    shipment: 'SHN-2026-901',
    date: '2026-08-20',
    size: '0.5 MB',
    status: 'مُعتمد',
    statusBg: '#D0FAE4',
    statusColor: '#009F65',
  },
  {
    id: 'DOC-005',
    name: 'شهادة التفتيش الجمركي',
    type: 'Inspection',
    refNo: 'INSP-SA-771',
    shipment: 'SHN-2026-901',
    date: '2026-08-19',
    size: '3.4 MB',
    status: 'مراجعة مطلوبة',
    statusBg: '#DCEEFD',
    statusColor: '#0894ED',
  },
]

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('الكل')
  const [searchTerm, setSearchTerm] = useState('')
  const [docsList, setDocsList] = useState(initialDocs)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Preview & Download States
  const [previewDoc, setPreviewDoc] = useState(null)
  const [downloadAlert, setDownloadAlert] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  const handlePreviewDoc = (doc) => {
    setPreviewDoc(doc)
  }

  const handleDownloadDoc = async (doc, simulateError = false) => {
    setDownloadingId(doc.id)
    try {
      await downloadShippingDocument(doc, { simulateError })
      setDownloadAlert({
        type: 'success',
        title: 'تم تحميل المستند بنجاح!',
        message: `تم حفظ مستند "${doc.name}" (${doc.size}) بنجاح على جهازك.`
      })
    } catch {
      setDownloadAlert({
        type: 'error',
        title: 'فشل تحميل المستند!',
        message: `تعذر إكمال تحميل "${doc.name}". يرجى التحقق من اتصال الشبكة والمحاولة مجدداً.`
      })
    } finally {
      setDownloadingId(null)
      setTimeout(() => setDownloadAlert(null), 5000)
    }
  }

  const fileInputRef = useRef(null)

  // Upload Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'B\\L',
    shipment: 'SHN-2026-884',
    refNo: '',
    date: '2026-11-02',
    notes: '',
    fileName: '',
    fileSize: ''
  })

  // Dynamic counts
  const approvedCount = docsList.filter((d) => d.status === 'مُعتمد').length
  const reviewCount = docsList.filter((d) => d.status === 'قيد المراجعة').length
  const editCount = docsList.filter((d) => d.status === 'مراجعة مطلوبة').length

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      setFormData({
        ...formData,
        fileName: file.name,
        fileSize: sizeInMb,
        name: formData.name || file.name.replace(/\.[^/.]+$/, '')
      })
    }
  }

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (!formData.name) return

    const newDoc = {
      id: `DOC-00${docsList.length + 1}`,
      name: formData.name,
      type: formData.type,
      refNo: formData.refNo || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      shipment: formData.shipment,
      date: formData.date || '2026-11-02',
      size: formData.fileSize || '1.8 MB',
      status: 'قيد المراجعة',
      statusBg: '#FEEBDF',
      statusColor: '#FB8731'
    }

    setDocsList([newDoc, ...docsList])
    setShowUploadModal(false)
    setFormData({
      name: '',
      type: 'B\\L',
      shipment: 'SHN-2026-884',
      refNo: '',
      date: '2026-11-02',
      notes: '',
      fileName: '',
      fileSize: ''
    })

    setToastMessage(`تم رفع واعتماد مستند "${newDoc.name}" بنجاح وهو الآن قيد التدقيق الجمركي!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const filtered = docsList.filter((doc) => {
    const matchesSearch =
      doc.name.includes(searchTerm) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.shipment.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesTab = true
    if (activeTab === 'معتمدة') matchesTab = doc.status === 'مُعتمد'
    else if (activeTab === 'قيد المراجعة') matchesTab = doc.status === 'قيد المراجعة'
    else if (activeTab === 'تتطلب تعديل') matchesTab = doc.status === 'مراجعة مطلوبة'

    return matchesSearch && matchesTab
  })

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] font-almarai" dir="rtl">
      <Sidebar activePath="/dashboard/documents" />

      <div className="flex-1 mr-[320px] flex flex-col justify-between">
        <div>
          {/* Header */}
          <DashboardHeader
            title="مستنداتي"
            subtitle="وثائق الشحن والجمارك والتأمين"
            icon={<FileText className="w-6 h-6" />}
          />

          <main className="p-8 space-y-6">
            {/* Toast Alert */}
            {toastMessage && (
              <div className="bg-[#011222] text-white px-6 py-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xl border border-white/10 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#009F65] shrink-0 animate-ping"></span>
                  <span>{toastMessage}</span>
                </div>
                <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white mr-4">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Download Status Toast (Success / Failure) */}
            {downloadAlert && (
              <div
                className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between text-white shadow-xl border animate-fade-in transition-all ${
                  downloadAlert.type === 'success'
                    ? 'bg-[#011222] border-[#009F65]/50 shadow-green-950/20'
                    : 'bg-[#011222] border-red-500/50 shadow-red-950/20'
                }`}
              >
                <div className="flex items-center gap-3.5 text-right">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                      downloadAlert.type === 'success'
                        ? 'bg-[#009F65] text-white shadow-green-500/25'
                        : 'bg-red-500 text-white shadow-red-500/25'
                    }`}
                  >
                    {downloadAlert.type === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          downloadAlert.type === 'success'
                            ? 'bg-[#009F65]/20 text-[#009F65] border border-[#009F65]/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {downloadAlert.type === 'success' ? 'تم التحميل بنجاح' : 'فشل التحميل'}
                      </span>
                      <h4 className="text-sm font-black text-white">{downloadAlert.title}</h4>
                    </div>
                    <p className="text-xs text-white/80 font-medium mt-1">
                      {downloadAlert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDownloadAlert(null)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer mr-3 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Top Bar with Provider & Upload Button */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-right">
                <span className="text-xs font-semibold text-[#64748B] block">مزود الخدمة</span>
                <h2 className="text-xl font-bold text-[#011222] mt-0.5">شركة الأفق للشحن الدولي</h2>
              </div>

              {/* Upload Button matching user screenshot */}
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#018FF8] hover:bg-[#007EE0] text-white text-xs font-black shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
              >
                <span>رفع مستند جديد</span>
                <Upload className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* 3 Stat Cards Row - matching XD Rectangle 264, 265, 266 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: مستندات معتمدة */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex items-center justify-between">
                <div className="text-right">
                  <div className="text-3xl font-black text-[#011222]">{approvedCount}</div>
                  <div className="text-xs font-bold text-[#64748B] mt-1">مستندات معتمدة</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#D0FAE4] flex items-center justify-center text-[#009F65]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              </div>

              {/* Card 2: قيد المراجعة */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex items-center justify-between">
                <div className="text-right">
                  <div className="text-3xl font-black text-[#011222]">{reviewCount}</div>
                  <div className="text-xs font-bold text-[#64748B] mt-1">قيد المراجعة</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#FEECD5] flex items-center justify-center text-[#FB8731]">
                  <Clock className="w-7 h-7" />
                </div>
              </div>

              {/* Card 3: تتطلب تعديل */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex items-center justify-between">
                <div className="text-right">
                  <div className="text-3xl font-black text-[#011222]">{editCount}</div>
                  <div className="text-xs font-bold text-[#64748B] mt-1">تتطلب تعديل</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#DCEEFD] flex items-center justify-center text-[#0894ED]">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Filter Tabs Container - matching XD Rectangle 267 */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {['الكل', 'معتمدة', 'قيد المراجعة', 'تتطلب تعديل'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#018FF8] text-white shadow-sm shadow-blue-500/20'
                        : 'text-[#64748B] hover:bg-gray-100 hover:text-[#011222]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث باسم المستند أو رقم الشحنة..."
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#018FF8] text-right"
                />
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Documents Table Container - matching XD Rectangle 74 & 76 */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-[#F0F3F8] border-b border-[#E2E8F0] text-[#011222] font-black text-xs">
                      <th className="py-4 px-6">المستند</th>
                      <th className="py-4 px-6">النوع</th>
                      <th className="py-4 px-6">المرجع</th>
                      <th className="py-4 px-6">الشحنة</th>
                      <th className="py-4 px-6">تاريخ الرفع</th>
                      <th className="py-4 px-6">الحجم</th>
                      <th className="py-4 px-6">الحالة</th>
                      <th className="py-4 px-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* المستند */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FEECD5] flex items-center justify-center text-[#FB8731] shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-[#011222] text-xs">{item.name}</p>
                              <span className="text-[11px] text-[#64748B] font-mono">{item.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* النوع */}
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-bold text-[#011222] font-mono">
                            {item.type}
                          </span>
                        </td>

                        {/* المرجع */}
                        <td className="py-4 px-6 text-xs font-mono text-[#64748B]">
                          {item.refNo || '—'}
                        </td>

                        {/* الشحنة */}
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-[#0894ED] font-mono">
                            {item.shipment}
                          </span>
                        </td>

                        {/* تاريخ الرفع */}
                        <td className="py-4 px-6 text-xs text-[#64748B] font-mono">
                          {item.date}
                        </td>

                        {/* الحجم */}
                        <td className="py-4 px-6 text-xs text-[#64748B] font-mono">
                          {item.size}
                        </td>

                        {/* الحالة */}
                        <td className="py-4 px-6">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: item.statusBg,
                              color: item.statusColor,
                            }}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* الإجراءات */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              title="معاينة المستند"
                              onClick={() => handlePreviewDoc(item)}
                              className="w-9 h-9 rounded-xl bg-[#F4F8FC] hover:bg-[#E2EDF8] flex items-center justify-center text-[#0894ED] transition-colors cursor-pointer active:scale-95 shadow-2xs"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              title="تحميل المستند"
                              disabled={downloadingId === item.id}
                              onClick={() => handleDownloadDoc(item)}
                              className="w-9 h-9 rounded-xl bg-[#F4F8FC] hover:bg-[#E2EDF8] flex items-center justify-center text-[#0894ED] transition-colors cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                            >
                              {downloadingId === item.id ? (
                                <span className="w-4 h-4 border-2 border-[#0894ED] border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Floating Moving Footer Bar & Bottom Dots */}
        <div className="px-8 pb-8 space-y-4">
          <DashboardFooterBar />
          <div className="w-full pt-3 clearfix" style={{ direction: 'ltr', textAlign: 'left' }} aria-hidden="true">
            <div className="flex items-center gap-2" style={{ float: 'left', direction: 'ltr' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* نافذة مودال: رفع وتوثيق مستند جديد (Upload Document Modal)    */}
      {/* ========================================================= */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 bg-[#011222]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-almarai"
          dir="rtl"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white rounded-[26px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 animate-scale-in text-right relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-black text-[#011222]">رفع مستند شحن جديد</h3>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    إرفاق بوالص الشحن والفواتير وشهادات المنشأ المعتمدة
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#018FF8] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                  <Upload className="w-5 h-5" />
                </div>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* اسم المستند */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#011222]">
                  اسم المستند *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بوليصة شحن بحري B/L - خط ميرسك"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#018FF8] text-right"
                />
              </div>

              {/* نوع المستند & رقم الشحنة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">نوع المستند *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#018FF8] text-right cursor-pointer"
                  >
                    <option value="B\L">بوليصة شحن (B\L)</option>
                    <option value="COO">شهادة منشأ (COO)</option>
                    <option value="Invoice">فاتورة تجارية (Invoice)</option>
                    <option value="Packing List">قائمة التعبئة (Packing List)</option>
                    <option value="Inspection">تفتيش جمركي (Inspection)</option>
                    <option value="Bayan">بيان جمركي (Bayan)</option>
                    <option value="Insurance">بوليصة تأمين (Insurance)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">رقم الشحنة المرتبطة *</label>
                  <select
                    value={formData.shipment}
                    onChange={(e) => setFormData({ ...formData, shipment: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#018FF8] text-right font-mono cursor-pointer"
                  >
                    <option value="SHN-2026-884">SHN-2026-884 (هامبورج - جبل علي)</option>
                    <option value="SHN-2026-756">SHN-2026-756 (مومباي - الدمام)</option>
                    <option value="SHN-2026-901">SHN-2026-901 (شنغهاي - أبو ظبي)</option>
                    <option value="SHN-2026-812">SHN-2026-812 (عمان - دبي)</option>
                  </select>
                </div>
              </div>

              {/* الرقم المرجعي & تاريخ الإصدار */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">رقم المرجع / البوليصة</label>
                  <input
                    type="text"
                    placeholder="مثال: MSK-994182"
                    value={formData.refNo}
                    onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#018FF8] text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">تاريخ الإصدار</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#018FF8] text-right"
                  />
                </div>
              </div>

              {/* Drag and Drop File Zone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#011222]">ملف المستند (PDF أو صورة) *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#018FF8]/40 hover:border-[#018FF8] bg-[#F4F9FD] hover:bg-[#EBF5FE] rounded-2xl p-6 text-center transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#018FF8]/20 flex items-center justify-center text-[#018FF8] mx-auto mb-2.5 shadow-xs group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6 stroke-[2]" />
                  </div>

                  {formData.fileName ? (
                    <div className="text-center">
                      <span className="text-xs font-black text-[#011222] block truncate">
                        {formData.fileName}
                      </span>
                      <span className="text-[11px] font-bold text-[#009F65] block mt-0.5">
                        جاهز للرفع ({formData.fileSize}) ✓
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-black text-[#011222] block">
                        اسحب وأفلت الملف هنا أو انقر لاختياره من جهازك
                      </span>
                      <span className="text-[10px] text-[#64748B] block mt-1 font-sans">
                        الملفات المدعومة: PDF, JPG, PNG (الحد الأقصى 15 ميجابايت)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ملاحظات إضافية */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#011222]">ملاحظات وتفاصيل إضافية</label>
                <textarea
                  rows="2"
                  placeholder="أي معلومات خاصة بالتوثيق أو الجمارك..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-right focus:outline-none focus:ring-2 focus:ring-[#018FF8]"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex-2 py-3 rounded-xl bg-[#018FF8] hover:bg-[#007EE0] text-white text-xs font-black shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>رفع واعتماد المستند الآن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة معاينة المستند الرسمي (Document Preview Modal) */}
      <DocumentPreviewModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        onDownload={(doc) => handleDownloadDoc(doc)}
      />
    </div>
  )
}
