import { useState, useRef } from 'react'
import ImporterSidebar from '../../../components/dashboard/ImporterSidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import DocumentPreviewModal from '../../../components/modals/DocumentPreviewModal'
import { downloadShippingDocument } from '../../../utils/documentDownloader'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import {
  FileText,
  Search,
  Bell,
  Upload,
  CheckSquare,
  Hourglass,
  FileEdit,
  Eye,
  Download,
  Globe,
  Receipt,
  Package,
  X,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react'

const initialDocs = [
  {
    id: 'DOC-001',
    name: 'بوليصة الشحن SHN-2026-884',
    icon: FileText,
    iconColor: 'text-[#FB8731]',
    iconBg: 'bg-[#FFF7ED] border-[#FB8731]/30',
    typeBadge: 'B\\L',
    shipment: 'SHN-2026-884',
    date: '2026-08-25',
    size: '1.2 MB',
    status: 'مُعتمد',
    statusType: 'approved',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    hasActions: true
  },
  {
    id: 'DOC-002',
    name: 'شهادة المنشأ - هامبورغ',
    icon: Globe,
    iconColor: 'text-[#0284C7]',
    iconBg: 'bg-[#EBF5FE] border-[#0284C7]/30',
    typeBadge: 'COO',
    shipment: 'SHN-2026-884',
    date: '2026-08-24',
    size: '0.8 MB',
    status: 'مُعتمد',
    statusType: 'approved',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    hasActions: false
  },
  {
    id: 'DOC-003',
    name: 'فاتورة التصدير التجارية',
    icon: Receipt,
    iconColor: 'text-[#10B981]',
    iconBg: 'bg-[#ECFDF5] border-[#10B981]/30',
    typeBadge: 'Invoice',
    shipment: 'SHN-2026-884',
    date: '2026-08-23',
    size: '2.1 MB',
    status: 'قيد المراجعة',
    statusType: 'review',
    statusBg: '#FFF3EA',
    statusColor: '#FB8731',
    hasActions: false
  },
  {
    id: 'DOC-004',
    name: 'قائمة التعبئة والتغليف',
    icon: Package,
    iconColor: 'text-[#FB8731]',
    iconBg: 'bg-[#FFF7ED] border-[#FB8731]/30',
    typeBadge: 'Packing List',
    shipment: 'SHN-2026-901',
    date: '2026-08-20',
    size: '0.5 MB',
    status: 'مُعتمد',
    statusType: 'approved',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    hasActions: true
  },
  {
    id: 'DOC-005',
    name: 'شهادة التفتيش الجمركي',
    icon: Search,
    iconColor: 'text-[#0284C7]',
    iconBg: 'bg-[#EBF5FE] border-[#0284C7]/30',
    typeBadge: 'Inspection',
    shipment: 'SHN-2026-901',
    date: '2026-08-19',
    size: '3.4 MB',
    status: 'مراجعة مطلوبة',
    statusType: 'edit',
    statusBg: '#EBF5FE',
    statusColor: '#0284C7',
    hasActions: false
  }
]

export default function ImporterDocumentsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoSarah = currentUser?.email === 'importer@meynaa.com'

  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('الكل')
  const [docsList, setDocsList] = useState(() => {
    if (isDemoSarah) return initialDocs
    try {
      const stored = localStorage.getItem(`meynaa_docs_${currentUser?.email || 'new'}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newDocName, setNewDocName] = useState('')
  const [newDocShipment, setNewDocShipment] = useState('SHN-2026-884')
  const [newDocType, setNewDocType] = useState('B\\L')
  const [newDocRef, setNewDocRef] = useState('')
  const [newDocDate, setNewDocDate] = useState('2026-11-02')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedFileSize, setUploadedFileSize] = useState('')
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

  const approvedCount = docsList.filter((d) => d.statusType === 'approved').length
  const reviewCount = docsList.filter((d) => d.statusType === 'review').length
  const editCount = docsList.filter((d) => d.statusType === 'edit').length

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      setUploadedFileName(file.name)
      setUploadedFileSize(sizeStr)
      if (!newDocName) {
        setNewDocName(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const filteredDocs = docsList.filter((doc) => {
    const matchesSearch =
      doc.name.includes(searchTerm) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.shipment.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'الكل') return true
    if (activeTab === 'معتمدة') return doc.statusType === 'approved'
    if (activeTab === 'قيد المراجعة') return doc.statusType === 'review'
    if (activeTab === 'تتطلب تعديل') return doc.statusType === 'edit'
    return true
  })

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (!newDocName) return

    const newDoc = {
      id: `DOC-00${docsList.length + 1}`,
      name: newDocName,
      icon: FileText,
      iconColor: 'text-[#0284C7]',
      iconBg: 'bg-[#EBF5FE] border-[#0284C7]/30',
      typeBadge: newDocType,
      shipment: newDocShipment,
      date: newDocDate || '2026-11-02',
      size: uploadedFileSize || '1.8 MB',
      status: 'قيد المراجعة',
      statusType: 'review',
      statusBg: '#FFF3EA',
      statusColor: '#FB8731',
      hasActions: true
    }

    const updated = [newDoc, ...docsList]
    setDocsList(updated)
    if (!isDemoSarah && currentUser?.email) {
      try {
        localStorage.setItem(`meynaa_docs_${currentUser.email}`, JSON.stringify(updated))
      } catch {}
    }
    setShowUploadModal(false)
    setNewDocName('')
    setNewDocRef('')
    setUploadedFileName('')
    setUploadedFileSize('')
    setToastMessage(`تم رفع واعتماد مستند "${newDoc.name}" بنجاح وهو الآن قيد التدقيق الجمركي!`)
    setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
      {/* Decorative Orange Disc at Top-Left Corner (Rectangle 23 in XD) */}
      <div
        className="absolute -top-14 -left-14 w-32 h-32 rounded-full bg-[#FB8731] pointer-events-none z-20"
        aria-hidden="true"
      ></div>

      {/* Decorative Warm Orange Shape at Bottom-Right Corner matching XD */}
      <div
        className="absolute -bottom-16 right-[300px] w-72 h-44 bg-[#FB8731]/80 rounded-[40px] rotate-12 pointer-events-none z-0 blur-xs"
        aria-hidden="true"
      ></div>

      {/* Importer Sidebar matching XD */}
      <ImporterSidebar activePath="/importer/documents" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top Header Bar: Title on Right, Search & Bell on Left */}
        <header className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-xs flex items-center justify-between">
          {/* Right: Title & Subtitle + Orange Document Icon */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl border border-[#FB8731]/30 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#011222]">مستنداتي</h1>
              <p className="text-[11px] text-gray-400 font-medium">وثائق الشحن والجمارك والتأمين</p>
            </div>
          </div>

          {/* Left: Search input & Notifications bell */}
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
          <div className="bg-[#011222] text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg border border-white/10 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#009F65]"></span>
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white">
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

        {/* 3 Stat Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 3 (Right in RTL): تتطلب تعديل */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5FE] border border-[#0284C7]/20 flex items-center justify-center text-[#0284C7]">
              <FileEdit className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#011222] block leading-none font-sans">
                {editCount}
              </span>
              <span className="text-xs font-bold text-gray-500 mt-1 block">تتطلب تعديل</span>
            </div>
          </div>

          {/* Card 2 (Middle): قيد المراجعة */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] border border-[#FB8731]/20 flex items-center justify-center text-[#FB8731]">
              <Hourglass className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#011222] block leading-none font-sans">
                {reviewCount}
              </span>
              <span className="text-xs font-bold text-gray-500 mt-1 block">قيد المراجعة</span>
            </div>
          </div>

          {/* Card 1 (Left in RTL): مستندات معتمدة */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#E6F9F0] border border-[#009F65]/20 flex items-center justify-center text-[#009F65]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#011222] block leading-none font-sans">
                {approvedCount}
              </span>
              <span className="text-xs font-bold text-gray-500 mt-1 block">مستندات معتمدة</span>
            </div>
          </div>
        </section>

        {/* Filter Tabs (Right) & Upload Button (Left, below 'مستندات معتمدة') */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Right: Filter Tabs Pill */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-1 flex items-center shadow-xs">
            {['الكل', 'معتمدة', 'قيد المراجعة', 'تتطلب تعديل'].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-gray-500 hover:text-[#011222]'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Left: Upload Button - positioned directly below 'مستندات معتمدة' */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs py-3 px-7 rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>رفع مستند جديد</span>
            <Upload className="w-4 h-4 stroke-[2.5]" />
          </button>
        </section>

        {/* Main Documents Table Card matching screenshot */}
        <section className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold">
                  <th className="pb-4 pr-3 text-right">المستند</th>
                  <th className="pb-4 text-center">النوع</th>
                  <th className="pb-4 text-right">الشحنة</th>
                  <th className="pb-4 text-right">تاريخ الرفع</th>
                  <th className="pb-4 text-right">الحجم</th>
                  <th className="pb-4 text-center">الحالة</th>
                  <th className="pb-4 text-left pl-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80 font-medium">
                {filteredDocs.map((item) => {
                  const Icon = item.icon
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* المستند: Icon + Name + Sub-code */}
                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
                          >
                            <Icon className="w-4 h-4 stroke-[2]" />
                          </div>
                          <div>
                            <span className="font-black text-[#011222] block text-xs">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono font-bold block mt-0.5">
                              {item.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* النوع: Tag badge */}
                      <td className="py-4 text-center">
                        <span className="inline-block bg-gray-100 text-gray-600 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          {item.typeBadge}
                        </span>
                      </td>

                      {/* الشحنة: Blue Code */}
                      <td className="py-4 text-right font-sans font-bold text-[#0284C7]">
                        {item.shipment}
                      </td>

                      {/* تاريخ الرفع */}
                      <td className="py-4 text-right font-sans text-gray-500 font-medium">
                        {item.date}
                      </td>

                      {/* الحجم */}
                      <td className="py-4 text-right font-sans text-gray-500 font-bold">
                        {item.size}
                      </td>

                      {/* الحالة */}
                      <td className="py-4 text-center">
                        <span
                          className="px-3.5 py-1 rounded-full text-xs font-bold inline-block min-w-[85px]"
                          style={{ backgroundColor: item.statusBg, color: item.statusColor }}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* إجراءات: Eye & Download buttons on left */}
                      <td className="py-4 text-left pl-3">
                        <div className="flex items-center gap-2 justify-start">
                          <button
                            title="معاينة المستند"
                            onClick={() => handlePreviewDoc(item)}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="تحميل المستند"
                            disabled={downloadingId === item.id}
                            onClick={() => handleDownloadDoc(item)}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-[#0284C7] transition-colors cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                          >
                            {downloadingId === item.id ? (
                              <span className="w-3.5 h-3.5 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredDocs.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF5FE] text-[#0284C7] flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#011222]">لا توجد مستندات مسجلة بعد</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  يمكنك رفع وثائق السجل التجاري، بوالص الشحن، أو الفواتير التجارية لحفظها ومشاركتها مع المخلصين الجمركيين.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] text-white text-xs font-bold rounded-xl hover:bg-[#0369A1] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>رفع أول مستند الآن</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer Bar inside Main Area matching screenshot */}
        <DashboardFooterBar />

        {/* Bottom 4 Orange Dots on Left */}
        <div className="w-full pt-3 clearfix" style={{ direction: 'ltr', textAlign: 'left' }}>
          <div className="flex items-center gap-2" style={{ float: 'left', direction: 'ltr' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]"></span>
          </div>
        </div>
      </main>

      {/* Modal: رفع مستند جديد */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#011222]/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in font-almarai"
          dir="rtl"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white rounded-[26px] p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl relative animate-scale-in my-8 max-h-[92vh] overflow-y-auto"
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
                <div className="w-11 h-11 rounded-2xl bg-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                  <Upload className="w-5 h-5" />
                </div>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#011222]">اسم المستند *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بوليصة شحن بحري B/L - خط ميرسك"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">نوع المستند *</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right cursor-pointer"
                  >
                    <option value="B\L">بوليصة شحن (B\L)</option>
                    <option value="COO">شهادة منشأ (COO)</option>
                    <option value="Invoice">فاتورة تجارية (Invoice)</option>
                    <option value="Packing List">قائمة تعبئة (Packing List)</option>
                    <option value="Inspection">تفتيش جمركي (Inspection)</option>
                    <option value="Bayan">بيان جمركي (Bayan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">رقم الشحنة المرتبطة *</label>
                  <select
                    value={newDocShipment}
                    onChange={(e) => setNewDocShipment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right font-mono cursor-pointer"
                  >
                    <option value="SHN-2026-884">SHN-2026-884 (هامبورج - جبل علي)</option>
                    <option value="SHN-2026-756">SHN-2026-756 (مومباي - الدمام)</option>
                    <option value="SHN-2026-901">SHN-2026-901 (شنغهاي - أبو ظبي)</option>
                    <option value="SHN-2026-867">SHN-2026-867 (روتردام - جدة)</option>
                    <option value="SHN-2026-923">SHN-2026-923 (عمان - دبي)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">رقم المرجع / البوليصة</label>
                  <input
                    type="text"
                    placeholder="مثال: MSK-994182"
                    value={newDocRef}
                    onChange={(e) => setNewDocRef(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">تاريخ الإصدار</label>
                  <input
                    type="date"
                    value={newDocDate}
                    onChange={(e) => setNewDocDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right"
                  />
                </div>
              </div>

              {/* Drag and Drop File Box */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#011222]">ملف المستند (PDF أو صورة) *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#0284C7]/40 hover:border-[#0284C7] bg-[#F4F9FD] hover:bg-[#EBF5FE] rounded-2xl p-6 text-center transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#0284C7]/20 flex items-center justify-center text-[#0284C7] mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6 stroke-[2]" />
                  </div>

                  {uploadedFileName ? (
                    <div className="text-center">
                      <span className="text-xs font-black text-[#011222] block truncate">
                        {uploadedFileName}
                      </span>
                      <span className="text-[11px] font-bold text-[#009F65] block mt-0.5">
                        جاهز للرفع ({uploadedFileSize}) ✓
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-black text-[#011222] block">
                        اسحب وأفلت الملف هنا أو انقر للاختيار من جهازك
                      </span>
                      <span className="text-[10px] text-[#64748B] block mt-1 font-sans">
                        الملفات المدعومة: PDF, JPG, PNG (الحد الأقصى 15 ميجابايت)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-[#0284C7] hover:bg-[#0369A1] text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>رفع واعتماد المستند</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Shipping Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        onDownload={(doc) => handleDownloadDoc(doc)}
      />
    </div>
  )
}
