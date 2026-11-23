import { useState } from 'react'
import AdminSidebar from '../../../components/dashboard/AdminSidebar'
import AdminHeader from '../../../components/dashboard/AdminHeader'
import {
  Search,
  Users,
  Shield,
  Clock,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Download,
  CheckCircle2,
  Check,
  Pause,
  X,
  FileText,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  MoreHorizontal,
  Mail,
  Lock,
  Phone,
  MapPin,
  UserCheck,
  Copy
} from 'lucide-react'

// Mock Users Data matching screenshot with credentials
const initialUsers = [
  {
    id: 'USR-101',
    name: 'شركة النور للاستيراد',
    accountType: 'شركة',
    category: 'مستورد',
    status: 'مفعل',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    regDate: '12/9/2026',
    crNumber: 'CR:12345678',
    email: 'info@alnoor-import.com',
    password: 'AlNoor#2026@Pass',
    phone: '+966 50 123 4567',
    address: 'الرياض - حي الملز، طريق الملك فهد',
    authorizedPerson: 'سالم عبدالله النور (المدير التنفيذي)',
    supervisor: 'أحمد المدير العام',
    permissions: ['Support Specialist'],
    providerType: 'وكيل شحن (Freight Forwarder)',
    documents: [
      { name: 'السجل التجاري', status: 'مقبول', statusColor: '#009F65' },
      { name: 'الشهادة الضريبية', status: 'مقبول', statusColor: '#009F65' },
      { name: 'ترخيص هيئة النقل والجمارك', status: 'مقبول', statusColor: '#009F65' }
    ]
  },
  {
    id: 'USR-102',
    name: 'مؤسسة الخليج اللوجستية',
    accountType: 'شركة',
    category: 'مزود خدمات',
    status: 'قيد المراجعة',
    statusBg: '#FFF4E8',
    statusColor: '#EA580C',
    regDate: '4/11/2026',
    crNumber: 'CR:87654321',
    email: 'support@gulf-logistics.sa',
    password: 'Gulf@2026_Secure99',
    phone: '+966 55 987 6543',
    address: 'الدمام - المدينة الصناعية الأولى',
    authorizedPerson: 'فيصل عبدالرحمن الخليجي (مدير العمليات)',
    supervisor: 'أحمد المدير العام',
    permissions: ['Customs Officer'],
    providerType: 'شركة شحن (Shipping Company)',
    documents: [
      { name: 'السجل التجاري', status: 'مقبول', statusColor: '#009F65' },
      { name: 'الشهادة الضريبية', status: 'مقبول', statusColor: '#009F65' },
      { name: 'ترخيص هيئة النقل والجمارك', status: 'قيد التدقيق', statusColor: '#EA580C' }
    ]
  },
  {
    id: 'USR-103',
    name: 'شركة العالمية السريعة',
    accountType: 'شركة',
    category: 'مستورد',
    status: 'مرفوض',
    statusBg: '#FEEAEA',
    statusColor: '#DC2626',
    regDate: '13/8/2026',
    crNumber: 'CR:45678912',
    email: 'admin@global-fast.com',
    password: 'Global!Fast#8812',
    phone: '+966 56 334 2211',
    address: 'جدة - ميناء جدة الإسلامي، مبنى 4',
    authorizedPerson: 'ماجد بن عيسى (مدير المشتريات)',
    supervisor: 'أحمد المدير العام',
    permissions: [],
    providerType: 'وكيل شحن (Freight Forwarder)',
    documents: [
      { name: 'السجل التجاري', status: 'مرفوض', statusColor: '#DC2626' },
      { name: 'الشهادة الضريبية', status: 'مرفوض', statusColor: '#DC2626' },
      { name: 'ترخيص هي النقل والجمارك', status: 'غير مرفق', statusColor: '#DC2626' }
    ]
  },
  {
    id: 'USR-104',
    name: 'أحمد محمد علي',
    accountType: 'مستخدم فردي',
    category: 'مستورد',
    status: 'مفعل',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    regDate: '25/8/2026',
    crNumber: 'الهوية: 1089332145',
    email: 'ahmed.ali.sa@gmail.com',
    password: 'AhmedAli_2026!Pass',
    phone: '+966 53 776 5544',
    address: 'المدينة المنورة - حي الهدا',
    authorizedPerson: 'أحمد محمد علي (مستورد شخصي)',
    supervisor: 'أحمد المدير العام',
    permissions: ['Support Specialist'],
    providerType: 'مستورد بضائع أفراد',
    documents: [
      { name: 'الهوية الوطنية', status: 'مقبول', statusColor: '#009F65' },
      { name: 'وثيقة العمل الحر', status: 'مقبول', statusColor: '#009F65' },
      { name: 'شهادة العنوان الوطني', status: 'مقبول', statusColor: '#009F65' }
    ]
  },
  {
    id: 'USR-105',
    name: 'شركة البحار للشحن',
    accountType: 'شركة',
    category: 'مزود خدمات',
    status: 'معلق مؤقتاً',
    statusBg: '#FFF0E6',
    statusColor: '#D97706',
    regDate: '25/10/2026',
    crNumber: 'CR:99887766',
    email: 'operations@albahar-shipping.com',
    password: 'Bahar#Cargo@2026',
    phone: '+966 50 445 6677',
    address: 'الجبيل - المنطقة الصناعية المساندة',
    authorizedPerson: 'إبراهيم منصور البحري (المدير اللوجستي)',
    supervisor: 'أحمد المدير العام',
    permissions: ['Financial Auditor'],
    providerType: 'مخلص جمركي (Customs Broker)',
    documents: [
      { name: 'السجل التجاري', status: 'مقبول', statusColor: '#009F65' },
      { name: 'الشهادة الضريبية', status: 'مقبول', statusColor: '#009F65' },
      { name: 'ترخيص هيئة النقل والجمارك', status: 'مطلوب تجديد', statusColor: '#D97706' }
    ]
  },
  {
    id: 'USR-106',
    name: 'شركة الشرق اللوجستية',
    accountType: 'شركة',
    category: 'مستورد',
    status: 'مفعل',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    regDate: '22/7/2026',
    crNumber: 'CR:33445566',
    email: 'contact@alsharq-logistics.com',
    password: 'Sharq!Meynaa#2026',
    phone: '+966 55 119 8877',
    address: 'الخبر - طريق الملك عبدالعزيز، برج الشرق',
    authorizedPerson: 'سلطان خالد الدوسري (نائب الرئيس)',
    supervisor: 'أحمد المدير العام',
    permissions: ['Super Admin', 'Financial Auditor'],
    providerType: 'وكيل شحن (Freight Forwarder)',
    documents: [
      { name: 'السجل التجاري', status: 'مقبول', statusColor: '#009F65' },
      { name: 'الشهادة الضريبية', status: 'مقبول', statusColor: '#009F65' },
      { name: 'ترخيص هيئة النقل والجمارك', status: 'مقبول', statusColor: '#009F65' }
    ]
  }
]

// Helper function outside component to generate user TXT report
function generateUserTxt(user) {
  const divider = '================================================================================'
  const subDivider = '--------------------------------------------------------------------------------'
  const now = new Date()
  const dateStr = now.toLocaleDateString('ar-SA')
  const timeStr = now.toLocaleTimeString('ar-SA')

  return `${divider}
                    منصة ميناء اللوجستية (MEYNAA)
                   بيانات الحساب والملف التعريفي للشركة
${divider}
تاريخ الاستخراج  : ${dateStr} - ${timeStr}
معرّف الحساب     : ${user.id}
حالة الحساب      : ${user.status}

[ 1. المعلومات الأساسية للشركة / المستخدم ]
${subDivider}
اسم المنشأة / المستخدم : ${user.name}
نوع الحساب           : ${user.accountType}
تصنيف المنشأة        : ${user.category}
نوع مزود الخدمة      : ${user.providerType || 'غير محدد'}
رقم السجل / الهوية   : ${user.crNumber}
تاريخ التسجيل        : ${user.regDate}
العنوان المعتمد      : ${user.address}
المسؤول المفوض        : ${user.authorizedPerson}
المشرف المعين        : ${user.supervisor}

[ 2. بيانات تسجيل الدخول والاتصال (سري للغاية) ]
${subDivider}
البريد الإلكتروني     : ${user.email}
كلمة المرور المؤقتة   : ${user.password}
رقم الهاتف المعتمد   : ${user.phone}

[ 3. مستندات التحقق المرفوعة (KYC) ]
${subDivider}
${user.documents.map((d) => `• ${d.name.padEnd(30, ' ')} [الحالة: ${d.status}]`).join('\n')}

[ 4. الصلاحيات الممنوحة في النظام ]
${subDivider}
${user.permissions && user.permissions.length > 0 ? user.permissions.map((p) => `• ${p}`).join('\n') : '• لا توجد صلاحيات إدارية إضافية'}

${divider}
ملاحظة أمنية:
هذه البيانات صادرة عن لوحة تحكم الإدارة العامة لمنصة ميناء اللوجستية، وتخضع لسياسات
حماية البيانات والسرية المصرفية والتجارية. يمنع تداولها أو مشاركتها مع أطراف غير مصرح لها.
${divider}
`
}

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState(initialUsers)
  const [selectedUser, setSelectedUser] = useState(initialUsers[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('جميع التصنيفات')
  const [filterAccountType, setFilterAccountType] = useState('جميع الحسابات')
  const [filterStatus, setFilterStatus] = useState('جميع الحالات')
  const [actionFeedback, setActionFeedback] = useState('')

  // Modal 1: Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRejectReason, setSelectedRejectReason] = useState('مستندات غير مكتملة')
  const [isRejectDropdownOpen, setIsRejectDropdownOpen] = useState(true)
  const [rejectDetails, setRejectDetails] = useState('')
  const [sendNotification, setSendNotification] = useState(true)

  // Modal 2: View User & Credentials Modal State (عند النقر على أيقونة العين)
  const [viewUserModal, setViewUserModal] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null)

  // Rejection reasons list matching screenshot
  const rejectReasons = [
    { id: 1, label: 'مستندات غير مكتملة', icon: FileText, iconColor: 'text-[#011222]' },
    { id: 2, label: 'بيانات الشركة غير صحيحة', icon: AlertTriangle, iconColor: 'text-amber-500' },
    { id: 3, label: 'شهادة تجارية منتهية', icon: Calendar, iconColor: 'text-[#011222]' },
    { id: 4, label: 'عدم مطابقة شروط التسجيل', icon: ShieldCheck, iconColor: 'text-[#011222]' },
    { id: 5, label: 'سبب أخر', icon: MoreHorizontal, iconColor: 'text-[#011222]' }
  ]

  // Permissions available matching screenshot
  const availablePermissions = [
    'Financial Auditor',
    'Support Specialist',
    'Customs Officer',
    'Super Admin'
  ]

  const handleTogglePermission = (perm) => {
    setSelectedUser((prev) => {
      const hasPerm = prev.permissions.includes(perm)
      const nextPerms = hasPerm
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm]
      return { ...prev, permissions: nextPerms }
    })
  }

  // Action status changes (اعتماد وتفعيل / إيقاف مؤقت / ترفض)
  const handleUpdateStatus = (newStatus, bg, color) => {
    const updated = {
      ...selectedUser,
      status: newStatus,
      statusBg: bg,
      statusColor: color
    }
    setSelectedUser(updated)
    setUsersList((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)))
    setActionFeedback(`تم تحديث حالة الحساب إلى: ${newStatus}`)
    setTimeout(() => setActionFeedback(''), 3000)
  }

  // Confirm Rejection from Modal
  const handleConfirmRejection = () => {
    const updated = {
      ...selectedUser,
      status: 'مرفوض',
      statusBg: '#FEEAEA',
      statusColor: '#DC2626'
    }
    setSelectedUser(updated)
    setUsersList((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)))
    setShowRejectModal(false)
    setActionFeedback(`تم رفض طلب تسجيل (${selectedUser.name}) بنجاح${sendNotification ? ' وإرسال إشعار للشركة' : ''}`)
    setTimeout(() => setActionFeedback(''), 4000)
  }

  // Copy to clipboard helper
  const handleCopy = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(fieldName)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  // Download user company data in a real .txt file
  const handleDownloadTxt = (user) => {
    const fileContent = generateUserTxt(user)
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `بيانات_${user.name.replace(/\s+/g, '_')}_${user.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setActionFeedback(`تم تحميل ملف بيانات (${user.name}) بصيغة TXT بنجاح`)
    setTimeout(() => setActionFeedback(''), 4000)
  }

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.crNumber.includes(searchTerm)
    const matchCategory =
      filterCategory === 'جميع التصنيفات' || u.category === filterCategory
    const matchAccountType =
      filterAccountType === 'جميع الحسابات' || u.accountType === filterAccountType
    const matchStatus =
      filterStatus === 'جميع الحالات' || u.status === filterStatus

    return matchSearch && matchCategory && matchAccountType && matchStatus
  })

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] relative overflow-hidden font-almarai" dir="rtl">
      {/* Right Fixed Admin Sidebar */}
      <AdminSidebar activePath="/admin/users" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[280px] flex flex-col min-h-screen select-none overflow-x-hidden">
        
        {/* Top Header Bar pinned edge-to-edge */}
        <AdminHeader searchValue={searchTerm} onSearch={setSearchTerm} />

        {/* Inner Content Area */}
        <div className="p-6 lg:p-8 space-y-6">
          
          {/* Subheader: إدارة المستخدمين */}
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
              إدارة المستخدمين
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-0.5">
              إدارة الحسابات, مراجعة المستندات, تعيين الصلاحيات
            </p>
          </div>

          {/* 1. TOP 4 METRIC CARDS ROW with Harmonious Translucent Tinted Backgrounds */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Card 1 (Far Right in RTL): المرفوضة (Translucent Purple Tint) */}
            <div className="bg-[#F5F3FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#DDD6FE]/70 hover:border-[#8B5CF6]/50 shadow-[0_2px_12px_rgba(124,58,237,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#6B21A8] block mb-1">المرفوضة</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  32
                </div>
                <span className="text-xs font-bold text-[#7C3AED] font-mono block mt-2">
                  6%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-xs">
                <Shield className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 2 (2nd from Right): قيد المراجعة (Translucent Emerald Green Tint) */}
            <div className="bg-[#ECFDF5]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#A7F3D0]/70 hover:border-[#10B981]/50 shadow-[0_2px_12px_rgba(16,185,129,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#065F46] block mb-1">قيد المراجعة</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  48
                </div>
                <span className="text-xs font-bold text-[#009F65] font-mono block mt-2">
                  8%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#A7F3D0] text-[#009F65] flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 3 (3rd from Right): المستخدمين النشطين (Translucent Sky Blue Tint) */}
            <div className="bg-[#F0F9FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#BAE6FD]/70 hover:border-[#0284C7]/50 shadow-[0_2px_12px_rgba(2,132,199,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#0369A1] block mb-1">المستخدمين النشطين</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  1,250
                </div>
                <span className="text-xs font-bold text-[#009F65] font-mono block mt-2">
                  14%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 4 (Far Left in RTL): الشركات المفعلة (Translucent Meynaa Orange Tint) */}
            <div className="bg-[#FFF7ED]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#FED7AA]/70 hover:border-[#FB8731]/50 shadow-[0_2px_12px_rgba(251,135,49,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#9A3412] block mb-1">الشركات المفعلة</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  250
                </div>
                <span className="text-xs font-bold text-[#009F65] font-mono block mt-2">
                  12%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#FED7AA] text-[#FB8731] flex items-center justify-center shrink-0 shadow-xs">
                <Building2 className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
          </section>

          {/* 2. MAIN WORKSPACE: USER INSPECTION CARD ON RIGHT + TABLE ON LEFT */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* RIGHT COLUMN (in RTL): Search Bar + Company/User Inspection Card matching screenshot */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Search Bar on top of the Inspection Card matching screenshot */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="البحث باسم الشركة أو المستخدم"
                  className="w-full bg-white border border-gray-200/90 rounded-full py-2.5 px-5 pl-11 text-xs text-right text-[#011222] placeholder-gray-400 focus:outline-none focus:border-[#FB8731] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Company / User Inspection Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5 text-right">
                
                {/* Section 1: معلومات الشركة */}
                <div className="text-right">
                  <span className="text-xs font-black text-[#011222] block mb-1.5">معلومات الشركة</span>
                  <h3 className="text-base sm:text-lg font-black text-[#011222]">
                    {selectedUser.name}
                  </h3>
                  <div className="text-xs text-gray-600 font-mono font-medium mt-1">
                    رقم السجل التجاري: {selectedUser.crNumber}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 font-bold">تصنيف الشركة:</span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#EBF5FE] text-[#0284C7]">
                      {selectedUser.category}
                    </span>
                  </div>
                </div>

                {/* Section 2: مستندات المراجعة (KYC) matching screenshot */}
                <div className="space-y-2.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-black text-[#011222]">
                    <div className="flex items-center gap-1.5">
                      <span>مستندات المراجعة (KYC)</span>
                      <CheckCircle2 className="w-4 h-4 text-[#009F65]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {selectedUser.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex flex-col justify-between"
                      >
                        <span className="text-[10px] font-bold text-gray-700 block line-clamp-2 h-7 leading-snug">
                          {doc.name}
                        </span>
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#009F65]" />
                          <span className="text-[10px] font-bold text-[#009F65]">
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: تحديد الصلاحيات و تعيين المشرف matching screenshot */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#011222]">
                    <span>تحديد الصلاحيات و تعيين المشرف</span>
                    <Shield className="w-4 h-4 text-[#0284C7]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                    {/* تعيين المشرف المسؤول */}
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 block mb-1">
                        تعيين المشرف المسؤول:
                      </span>
                      <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-2 flex items-center justify-between text-xs font-bold text-[#011222]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-white text-gray-600">
                            <Users className="w-3 h-3" />
                          </div>
                          <span className="text-[11px]">{selectedUser.supervisor}</span>
                        </div>
                      </div>
                    </div>

                    {/* الصلاحيات (Checkboxes) */}
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 block mb-1">
                        الصلاحيات
                      </span>
                      <div className="space-y-1.5">
                        {availablePermissions.map((perm) => {
                          const isChecked = selectedUser.permissions.includes(perm)
                          return (
                            <label
                              key={perm}
                              onClick={() => handleTogglePermission(perm)}
                              className="flex items-center justify-between text-[11px] font-mono font-bold text-[#011222] cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors"
                            >
                              <span dir="ltr">{perm}</span>
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
                                  isChecked ? 'bg-[#011222] text-white' : 'border border-gray-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: تصنيف مزودي الخدمات اللوجستية matching screenshot */}
                <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-3 space-y-2 text-center">
                  <span className="text-[11px] font-black text-[#0284C7] block">
                    تصنيف مزودي الخدمات اللوجستية
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold text-gray-700">
                    <div className="p-1.5 rounded-xl bg-white shadow-2xs">
                      وكيل شحن
                      <span className="block text-[8px] text-gray-400 font-mono">(Freight Forwarder)</span>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white shadow-2xs">
                      مخلص جمركي
                      <span className="block text-[8px] text-gray-400 font-mono">(Customs Broker)</span>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white shadow-2xs">
                      شركة شحن
                      <span className="block text-[8px] text-gray-400 font-mono">(Shipping Company)</span>
                    </div>
                  </div>
                </div>

                {/* Section 5: Decision Buttons matching screenshot */}
                <div className="pt-2">
                  {actionFeedback && (
                    <div className="p-2 mb-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#009F65] text-xs font-bold text-center animate-fade-in">
                      {actionFeedback}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {/* 1. اعتماد وتفعيل الحساب (Orange) */}
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('مفعل', '#E6F9F0', '#009F65')}
                      className="py-2.5 px-2 bg-[#FB8731] hover:bg-[#e07525] active:scale-95 text-white text-[11px] font-black rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>اعتماد وتفعيل الحساب</span>
                    </button>

                    {/* 2. إيقاف مؤقت (Outline Orange) */}
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('معلق مؤقتاً', '#FFF0E6', '#D97706')}
                      className="py-2.5 px-2 bg-white hover:bg-orange-50/50 border border-[#FB8731] active:scale-95 text-[#FB8731] text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>إيقاف مؤقت</span>
                    </button>

                    {/* 3. ترفض (Outline Red) -> Opens Rejection Modal */}
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="py-2.5 px-2 bg-white hover:bg-red-50 border border-red-400 active:scale-95 text-red-600 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ترفض</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT COLUMN (in RTL): Filters and Users Table matching screenshot */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* 3 Dropdown Filter Pills matching screenshot */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs font-bold justify-start">
                
                {/* 1. تصنيف الشركات */}
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-200/90 rounded-full pr-4 pl-9 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FB8731] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer"
                  >
                    <option value="جميع التصنيفات">تصنيف الشركات</option>
                    <option value="مستورد">مستورد</option>
                    <option value="مزود خدمات">مزود خدمات</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 2. نوع الحساب */}
                <div className="relative">
                  <select
                    value={filterAccountType}
                    onChange={(e) => setFilterAccountType(e.target.value)}
                    className="appearance-none bg-white border border-gray-200/90 rounded-full pr-4 pl-9 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FB8731] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer"
                  >
                    <option value="جميع الحسابات">نوع الحساب</option>
                    <option value="شركة">شركة</option>
                    <option value="مستخدم فردي">مستخدم فردي</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 3. جميع الحالات */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-white border border-gray-200/90 rounded-full pr-4 pl-9 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FB8731] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer"
                  >
                    <option value="جميع الحالات">جميع الحالات</option>
                    <option value="مفعل">مفعل</option>
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="مرفوض">مرفوض</option>
                    <option value="معلق مؤقتاً">معلق مؤقتاً</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Main Users Table matching screenshot */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold pb-3">
                        <th className="pb-3 pr-2 text-right">اسم الشركه/المستخدم</th>
                        <th className="pb-3 text-center">نوع الحساب</th>
                        <th className="pb-3 text-center">تصنيف الشركه</th>
                        <th className="pb-3 text-center">الحاله</th>
                        <th className="pb-3 text-center font-mono">تاريخ التسجيل</th>
                        <th className="pb-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {filteredUsers.map((item) => {
                        const isSelected = selectedUser.id === item.id

                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedUser(item)}
                            className={`hover:bg-orange-50/40 transition-colors cursor-pointer ${
                              isSelected ? 'bg-[#FFF7ED]/70 font-bold' : ''
                            }`}
                          >
                            {/* اسم الشركة / المستخدم */}
                            <td className="py-4 pr-2 text-[#011222] font-black">
                              <span>{item.name}</span>
                            </td>

                            {/* نوع الحساب (Light Blue Pill) */}
                            <td className="py-4 text-center">
                              <span className="inline-block bg-[#EAF3FD] text-[#0284C7] font-bold text-[11px] px-3.5 py-1 rounded-full">
                                {item.accountType}
                              </span>
                            </td>

                            {/* تصنيف الشركة */}
                            <td className="py-4 text-center text-gray-600 font-bold">
                              {item.category}
                            </td>

                            {/* الحالة */}
                            <td className="py-4 text-center">
                              <span
                                className="px-3.5 py-1 rounded-full text-[11px] font-bold inline-block min-w-[75px]"
                                style={{ backgroundColor: item.statusBg, color: item.statusColor }}
                              >
                                {item.status}
                              </span>
                            </td>

                            {/* تاريخ التسجيل */}
                            <td className="py-4 text-center font-mono text-gray-500">
                              {item.regDate}
                            </td>

                            {/* الإجراءات (Eye & Download) */}
                            <td className="py-4 text-center">
                              <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                {/* 1. Eye Button: Open Credentials & Full Details Modal */}
                                <button
                                  type="button"
                                  onClick={() => setViewUserModal(item)}
                                  className="w-8 h-8 rounded-xl bg-white border border-gray-200/90 hover:border-[#FB8731] hover:text-[#FB8731] hover:bg-orange-50/30 text-gray-500 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                                  title="عرض تفاصيل الشركة وبيانات تسجيل الدخول"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {/* 2. Download Button: Download Data as TXT File */}
                                <button
                                  type="button"
                                  onClick={() => handleDownloadTxt(item)}
                                  className="w-8 h-8 rounded-xl bg-white border border-gray-200/90 hover:border-[#0284C7] hover:text-[#0284C7] hover:bg-blue-50/30 text-gray-500 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                                  title="تحميل كافة بيانات الشركة في ملف نصي (TXT)"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-xs font-bold">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      لا توجد شركات أو مستخدمين يطابقون خيارات البحث والتصفية.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 3. MODAL: VIEW COMPANY DETAILS & CREDENTIALS (عند النقر على أيقونة العين) */}
        {viewUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
            <div
              className="bg-white rounded-[28px] border border-gray-150 shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative text-right font-almarai overflow-y-auto max-h-[90vh] animate-scale-up"
              dir="rtl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setViewUserModal(null)}
                className="absolute top-6 left-6 text-gray-400 hover:text-[#011222] transition-colors p-1 rounded-lg cursor-pointer"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Header */}
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-orange-50 text-[#FB8731] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
                    الملف الكامل وبيانات تسجيل الدخول
                  </h2>
                </div>
                <div className="h-1.5 w-16 bg-[#FB8731] rounded-full mt-2 mb-1" />
                <p className="text-xs text-gray-500 font-bold">
                  بيانات الحساب المعتمدة وتفاصيل تسجيل الدخول الخاصة بـ: <span className="text-[#011222] font-black">{viewUserModal.name}</span>
                </p>
              </div>

              {/* 1. SECURE CREDENTIALS CARD (بيانات تسجيل الدخول) */}
              <div className="bg-gradient-to-r from-[#011222] to-[#0a2540] text-white rounded-2xl p-5 mb-5 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#FB8731]" />
                    <span className="text-xs font-black text-white">بيانات تسجيل الدخول (سري)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-300">
                    معرف الحساب: {viewUserModal.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-300 mb-1">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                        البريد الإلكتروني
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(viewUserModal.email, 'email')}
                        className="text-[10px] font-mono font-bold text-[#38BDF8] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        title="نسخ البريد"
                      >
                        {copiedKey === 'email' ? <Check className="w-3 h-3 text-[#009F65]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'email' ? 'تم النسخ!' : 'نسخ'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs font-black text-white select-all text-left" dir="ltr">
                      {viewUserModal.email}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-300 mb-1">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Lock className="w-3.5 h-3.5 text-[#FB8731]" />
                        كلمة المرور
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[10px] text-gray-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title={showPassword ? 'إخفاء' : 'إظهار'}
                        >
                          {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(viewUserModal.password, 'password')}
                          className="text-[10px] font-mono font-bold text-[#FB8731] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title="نسخ كلمة المرور"
                        >
                          {copiedKey === 'password' ? <Check className="w-3 h-3 text-[#009F65]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'password' ? 'تم النسخ!' : 'نسخ'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-black text-white select-all text-left" dir="ltr">
                      {showPassword ? viewUserModal.password : '••••••••••••••••'}
                    </div>
                  </div>
                </div>

                {/* Phone & Authorized Person */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-[#009F65]" />
                    <span className="font-bold">الهاتف:</span>
                    <span className="font-mono font-bold text-white text-left" dir="ltr">{viewUserModal.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <UserCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="font-bold">المفوض:</span>
                    <span className="font-bold text-white truncate">{viewUserModal.authorizedPerson}</span>
                  </div>
                </div>
              </div>

              {/* 2. CORPORATE & REGISTRATION DETAILS */}
              <div className="bg-[#F8FAFC] border border-gray-200/80 rounded-2xl p-4 mb-5 space-y-3">
                <span className="text-xs font-black text-[#011222] block">البيانات الرسمية واللوجستية</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold block text-[11px]">رقم السجل / الهوية</span>
                    <span className="font-mono font-black text-[#011222]">{viewUserModal.crNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[11px]">نوع الحساب والتصنيف</span>
                    <span className="font-bold text-[#011222]">{viewUserModal.accountType} - {viewUserModal.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[11px]">تاريخ التسجيل</span>
                    <span className="font-mono font-bold text-[#011222]">{viewUserModal.regDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[11px]">حالة الاعتماد</span>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-0.5"
                      style={{ backgroundColor: viewUserModal.statusBg, color: viewUserModal.statusColor }}
                    >
                      {viewUserModal.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[11px]">المشرف المسؤول</span>
                    <span className="font-bold text-[#011222]">{viewUserModal.supervisor}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[11px]">نوع مزود الخدمة</span>
                    <span className="font-bold text-[#0284C7] text-[11px]">{viewUserModal.providerType}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="font-bold">العنوان المعتمد:</span>
                  <span className="font-medium">{viewUserModal.address}</span>
                </div>
              </div>

              {/* 3. KYC DOCUMENTS STATUS */}
              <div className="mb-6">
                <span className="text-xs font-black text-[#011222] block mb-2">مستندات التحقق المعتمدة (KYC)</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {viewUserModal.documents.map((doc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-gray-700 block line-clamp-1">{doc.name}</span>
                      <span className="text-[10px] font-bold text-[#009F65] block mt-1">✓ {doc.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {/* Download TXT Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadTxt(viewUserModal)}
                  className="px-5 py-2.5 bg-[#011222] hover:bg-[#0a2540] active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#FB8731]" />
                  <span>تحميل ملف البيانات (TXT)</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setViewUserModal(null)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. MODAL: REJECTION (رفض طلب تسجيل الشركة) matching screenshot 1:1 */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
            {/* Modal Box */}
            <div
              className="bg-white rounded-[28px] border border-gray-150 shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative text-right font-almarai overflow-hidden animate-scale-up"
              dir="rtl"
            >
              {/* Close X Button (Top Left in RTL) */}
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="absolute top-6 left-6 text-sky-500 hover:text-sky-700 transition-colors p-1 rounded-lg cursor-pointer"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Header: رفض طلب تسجيل الشركة */}
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
                  رفض طلب تسجيل الشركة
                </h2>
                {/* Red Underline Bar */}
                <div className="h-1.5 w-14 bg-[#DC2626] rounded-full mt-1.5 mb-1" />
                <p className="text-xs text-gray-500 font-bold">
                  يرجى تحديد سبب الرفض و تقديم التفاصيل اللازمة
                </p>
              </div>

              {/* Company Banner: بانتظار تأكيد الرفض + اسم الشركة والسجل */}
              <div className="bg-[#EFF4FB] rounded-2xl p-4 mb-6 flex items-center justify-between">
                {/* Right: Red Pill Status */}
                <div className="bg-[#FEEAEA] text-[#DC2626] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-red-100 shadow-2xs">
                  بانتظار تأكيد الرفض
                </div>

                {/* Divider Line */}
                <div className="w-px h-10 bg-gray-300/70 mx-4" />

                {/* Left: Company Name & Registration */}
                <div className="text-left flex-1 pl-2">
                  <h4 className="text-sm sm:text-base font-black text-[#011222]">
                    {selectedUser.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono font-medium mt-0.5">
                    رقم التسجيل:{selectedUser.crNumber}
                  </p>
                </div>
              </div>

              {/* Form Grid: 2 Columns (سبب الرفض on right + تفاصيل إضافية on left) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 items-start">
                
                {/* Right Column: سبب الرفض * */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#011222] block">
                    سبب الرفض <span className="text-red-500">*</span>
                  </label>

                  {/* Dropdown Select Trigger Box matching screenshot */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRejectDropdownOpen(!isRejectDropdownOpen)}
                      className="w-full bg-white border-2 border-[#0284C7] rounded-2xl p-3 text-xs font-bold text-[#011222] flex items-center justify-between cursor-pointer focus:outline-none shadow-2xs"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-[#011222] transition-transform ${
                          isRejectDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                      <span>{selectedRejectReason || 'اختر سبب الرفض'}</span>
                    </button>

                    {/* Dropdown Options List matching screenshot */}
                    {isRejectDropdownOpen && (
                      <div className="mt-2 bg-white border border-gray-200/90 rounded-2xl p-2 shadow-lg space-y-1">
                        {rejectReasons.map((reason) => {
                          const IconComp = reason.icon
                          const isReasonSelected = selectedRejectReason === reason.label

                          return (
                            <button
                              key={reason.id}
                              type="button"
                              onClick={() => {
                                setSelectedRejectReason(reason.label)
                                setIsRejectDropdownOpen(false)
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                isReasonSelected
                                  ? 'bg-blue-50 text-[#0284C7]'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>{reason.label}</span>
                              <IconComp className={`w-4 h-4 ${reason.iconColor}`} />
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Left Column: تفاصيل إضافية * */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#011222] block">
                    تفاصيل إضافية <span className="text-red-500">*</span>
                  </label>

                  {/* Textarea matching screenshot */}
                  <textarea
                    rows={4}
                    value={rejectDetails}
                    onChange={(e) => setRejectDetails(e.target.value)}
                    placeholder="اكتب تفاصيل سبب الرفض هنا......"
                    className="w-full bg-[#EFF4FB] border border-gray-200/70 rounded-2xl p-3.5 text-xs text-[#011222] placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:bg-white transition-all resize-none shadow-inner"
                  />

                  {/* Checkbox: إرسال إشعار للشركة بسبب الرفض */}
                  <div className="pt-2 flex items-center gap-2 justify-end">
                    <label htmlFor="sendRejectNotification" className="text-xs font-bold text-[#011222] cursor-pointer">
                      إرسال إشعار للشركة بسبب الرفض
                    </label>
                    <input
                      id="sendRejectNotification"
                      type="checkbox"
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#0284C7] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer matching screenshot */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 justify-start">
                {/* 1. تأكيد الرفض (Red) */}
                <button
                  type="button"
                  onClick={handleConfirmRejection}
                  className="px-6 py-2.5 bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-red-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>تأكيد الرفض</span>
                </button>

                {/* 2. إلغاء (Outline Blue) */}
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-6 py-2.5 bg-white hover:bg-blue-50/50 border border-[#0284C7] active:scale-95 text-[#0284C7] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
