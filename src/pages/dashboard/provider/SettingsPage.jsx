import { useState, useEffect } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import {
  Search,
  Bell,
  Globe,
  Shield,
  Folder,
  FileText,
  Save,
  Ship,
  Truck,
  Plane,
  Warehouse,
  ShieldCheck,
  Plus,
  Trash2,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  X,
  MapPin,
  Anchor
} from 'lucide-react'

export default function SettingsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser, setUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoProvider = currentUser?.email === 'provider@meynaa.com'

  const [activeTab, setActiveTab] = useState('بيانات الشركة')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Tab 1: Company Profile Form Data
  const [formData, setFormData] = useState(() => ({
    companyName: isDemoProvider ? 'شركة الأفق للشحن الدولي' : (currentUser?.companyName || 'شركة شحن ونقل'),
    managerName: isDemoProvider ? 'خالد العمري' : (currentUser?.fullName || 'المفوض العام'),
    email: isDemoProvider ? 'k.omari@ufo-shipping.ae' : (currentUser?.email || ''),
    phone: isDemoProvider ? '+971 50 887 3421' : (currentUser?.phone || ''),
    headquarters: isDemoProvider ? 'دبي _ الإمارات العربية المتحدة' : (currentUser?.companyAddress || 'المقر الرئيسي'),
    licenseNumber: isDemoProvider ? 'TR-2021-88432' : (currentUser?.crNumber || 'CR-2026-001'),
    taxNumber: isDemoProvider ? 'TAX-994821039' : 'TAX-2026',
    establishedYear: isDemoProvider ? '2016' : '2026'
  }))

  // قراءة بيانات مزود الخدمة المباشرة من قاعدة البيانات فور فتح الصفحة
  useEffect(() => {
    if (isDemoProvider) return
    authService.getProfile()
      .then((res) => {
        const u = res?.data
        if (u) {
          if (setUser) setUser(u)
          setFormData((prev) => ({
            ...prev,
            managerName: u.fullName || prev.managerName,
            companyName: u.companyName || u.companyProfile?.companyNameAr || prev.companyName,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            licenseNumber: u.crNumber || u.companyProfile?.crNumber || prev.licenseNumber
          }))
        }
      })
      .catch(() => {})
  }, [isDemoProvider, setUser])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSaveCompany = async (e) => {
    e.preventDefault()

    try {
      await authService.updateProfile({
        fullName: formData.managerName,
        companyName: formData.companyName,
        phone: formData.phone,
        crNumber: formData.licenseNumber
      })
      showToast('تم تحديث وحفظ بيانات المنشأة في قاعدة البيانات بنجاح!')
    } catch {
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          fullName: formData.managerName,
          companyName: formData.companyName,
          companyAddress: formData.headquarters,
          phone: formData.phone,
          crNumber: formData.licenseNumber
        }
        localStorage.setItem('meynaa_user', JSON.stringify(updatedUser))
        window.dispatchEvent(new Event('storage'))
      }
      showToast('تم حفظ بيانات المنشأة محلياً!')
    }
  }

  // Tab 2: Services & Regions Data
  const [services, setServices] = useState([
    {
      id: 'srv-1',
      title: 'التخليص الجمركي البحري',
      desc: 'فسوحات فورية، إنهاء المعاملات، ودفع الرسوم الجمركية في كافة الموانئ',
      icon: Anchor,
      enabled: true,
      tag: 'خدمة رئيسية'
    },
    {
      id: 'srv-2',
      title: 'الشحن البحري للحاويات (FCL / LCL)',
      desc: 'حجز حاويات كاملة ومجزأة عبر أكبر الخطوط الملاحية العالمية المعتمدة',
      icon: Ship,
      enabled: true,
      tag: 'شحن دولي'
    },
    {
      id: 'srv-3',
      title: 'النقل البري وتوزيع الشحنات',
      desc: 'أسطول شاحنات حديث مجهز بنظام التتبع الفوري لنقل البضائع بين المدن والموانئ',
      icon: Truck,
      enabled: true,
      tag: 'نقل سريع'
    },
    {
      id: 'srv-4',
      title: 'التخليص الجمركي الجوي',
      desc: 'تخليص الشحنات العاجلة والطرود عبر صالات وقرى الشحن الجوي في المطارات',
      icon: Plane,
      enabled: true,
      tag: 'شحن جوي'
    },
    {
      id: 'srv-5',
      title: 'المستودعات والتخزين الجمركي',
      desc: 'مستودعات مؤمنة ومكيفة للتخزين المؤقت وطويل الأمد بالقرب من المنافذ',
      icon: Warehouse,
      enabled: true,
      tag: 'تخزين آمن'
    },
    {
      id: 'srv-6',
      title: 'التأمين الشامل على البضائع',
      desc: 'وثائق تأمين بحرية وبرية تغطي كافة المخاطر أثناء النقل والتفريغ',
      icon: ShieldCheck,
      enabled: false,
      tag: 'تأمين اختياري'
    }
  ])

  const toggleService = (id) => {
    setServices(
      services.map((srv) => (srv.id === id ? { ...srv, enabled: !srv.enabled } : srv))
    )
    showToast('تم تحديث حالة الخدمة اللوجستية')
  }

  // Ports & Coverage Areas
  const [ports, setPorts] = useState([
    {
      id: 'port-1',
      name: 'ميناء الملك عبدالعزيز بالدمام',
      region: 'المنطقة الشرقية، المملكة العربية السعودية',
      type: 'ميناء بحري تجاري',
      status: 'تغطية كاملة 24/7'
    },
    {
      id: 'port-2',
      name: 'ميناء جدة الإسلامي',
      region: 'المنطقة الغربية، المملكة العربية السعودية',
      type: 'ميناء بحري رئيسي',
      status: 'تغطية كاملة 24/7'
    },
    {
      id: 'port-3',
      name: 'ميناء الملك عبدالله برابغ',
      region: 'مدينة الملك عبدالله الاقتصادية',
      type: 'ميناء حاويات فائق التطور',
      status: 'تغطية نشطة'
    },
    {
      id: 'port-4',
      name: 'مطار الملك خالد الدولي (قرية الشحن)',
      region: 'الرياض، المملكة العربية السعودية',
      type: 'منفذ جوي',
      status: 'تغطية كاملة 24/7'
    },
    {
      id: 'port-5',
      name: 'ميناء جبل علي',
      region: 'دبي، الإمارات العربية المتحدة',
      type: 'مركز الشحن الإقليمي',
      status: 'المقر والميناء الرئيسي'
    },
    {
      id: 'port-6',
      name: 'منفذ البطحاء البري',
      region: 'الحدود الإماراتية - السعودية',
      type: 'منفذ بري لشاحنات الترانزيت',
      status: 'تغطية نشطة'
    }
  ])

  const [showPortModal, setShowPortModal] = useState(false)
  const [newPort, setNewPort] = useState({ name: '', region: '', type: 'ميناء بحري', status: 'تغطية نشطة' })

  const handleAddPort = (e) => {
    e.preventDefault()
    if (!newPort.name) return
    const portObj = {
      id: `port-${ports.length + 1}`,
      name: newPort.name,
      region: newPort.region || 'المملكة العربية السعودية',
      type: newPort.type,
      status: newPort.status
    }
    setPorts([...ports, portObj])
    setShowPortModal(false)
    setNewPort({ name: '', region: '', type: 'ميناء بحري', status: 'تغطية نشطة' })
    showToast('تمت إضافة منطقة التغطية بنجاح!')
  }

  const handleDeletePort = (id) => {
    setPorts(ports.filter((p) => p.id !== id))
    showToast('تم حذف منطقة التغطية')
  }

  // Tab 3: Notification Preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    whatsappAlerts: true,
    inAppAlerts: true,
    newRfqMatches: true,
    bidAccepted: true,
    bidExpiring: true,
    shipmentTracking: true,
    customsClearance: true,
    emergencyDelays: true,
    weeklyReport: false
  })

  const handleSaveNotifications = (e) => {
    e.preventDefault()
    showToast('تم حفظ تفضيلات الإشعارات بنجاح!')
  }

  // Tab 4: Security
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    if (!securityForm.newPassword || !securityForm.currentPassword) {
      showToast('يرجى إدخال كلمة المرور الحالية والجديدة')
      return
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast('كلمتا المرور غير متطابقتين!')
      return
    }
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    showToast('تم تحديث كلمة المرور بنجاح!')
  }

  return (
    <div className="flex min-h-screen bg-[#F0F3F8] relative overflow-hidden font-almarai" dir="rtl">
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
      <Sidebar activePath="/dashboard/settings" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top White Header Bar - Rectangle 176 in XD */}
        <header className="bg-white rounded-2xl px-8 py-5 shadow-xs border border-gray-100 flex items-center justify-between">
          {/* Right: Title & Subtitle */}
          <div className="text-right">
            <h1 className="text-2xl font-black text-[#011222] tracking-tight">الإعدادات</h1>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">بيانات شركاتك و إعدادات الحساب</p>
          </div>

          {/* Left: Search input + Notification bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
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

        {/* Top Dark Banner Card - Rectangle 178 in XD (1511x150 rgb 1,18,34) */}
        <section className="bg-[#011222] rounded-[25px] px-8 py-6 shadow-xl text-white relative overflow-hidden flex items-center justify-between min-h-[140px]">
          {/* Decorative Orange Wave at the bottom edge */}
          <div
            className="absolute bottom-0 right-48 pointer-events-none z-0 hidden sm:block"
            aria-hidden="true"
          >
            <svg width="280" height="70" viewBox="0 0 280 70" fill="none">
              <path
                d="M 0 70 C 50 30 120 10 180 30 C 230 50 260 70 280 70 Z"
                fill="#FB8731"
              />
            </svg>
          </div>

          {/* Right: Company Profile Info + Orange Ballot Icon Box */}
          <div className="flex items-center gap-4 text-right relative z-10">
            {/* Rectangle 212 in XD: 65x67 orange box with ballot icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/30">
              <FileText className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                {formData.companyName}
              </h2>
              <p className="text-xs text-white/80 font-medium mt-1">
                {formData.managerName} - {isDemoProvider ? 'مدير عام' : 'المفوض بالتوقيع'}
              </p>
              <p className="text-xs text-white/60 font-mono mt-0.5">
                {formData.email}
              </p>
            </div>
          </div>

          {/* Left: Premium Button (Rectangle 213 in XD) */}
          <div className="relative z-10">
            <div className="px-7 py-2.5 rounded-xl bg-[#FB8731] text-white text-xs font-black shadow-md shadow-orange-500/20">
              Premium
            </div>
          </div>
        </section>

        {/* Tabs Bar Container - Rectangle 214 in XD (756x63) */}
        {/* 4 Tabs Pill - Positioned on Right, starting with 'بيانات الشركة' */}
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl p-1.5 shadow-xs border border-gray-200/80 flex items-center gap-1">
            {/* Tab 1: بيانات الشركة */}
            <button
              onClick={() => setActiveTab('بيانات الشركة')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'بيانات الشركة'
                  ? 'bg-[#FB8731] text-white shadow-md shadow-orange-500/20'
                  : 'text-[#64748B] hover:text-[#011222]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>بيانات الشركة</span>
            </button>

            {/* Tab 2: الخدمات و المناطق */}
            <button
              onClick={() => setActiveTab('الخدمات و المناطق')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'الخدمات و المناطق'
                  ? 'bg-[#FB8731] text-white shadow-md shadow-orange-500/20'
                  : 'text-[#64748B] hover:text-[#011222]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>الخدمات و المناطق</span>
            </button>

            {/* Tab 3: الإشعارات */}
            <button
              onClick={() => setActiveTab('الإشعارات')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'الإشعارات'
                  ? 'bg-[#FB8731] text-white shadow-md shadow-orange-500/20'
                  : 'text-[#64748B] hover:text-[#011222]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>الإشعارات</span>
            </button>

            {/* Tab 4: الأمان */}
            <button
              onClick={() => setActiveTab('الأمان')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'الأمان'
                  ? 'bg-[#FB8731] text-white shadow-md shadow-orange-500/20'
                  : 'text-[#64748B] hover:text-[#011222]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>الأمان</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: بيانات الشركة                                       */}
        {/* ========================================================= */}
        {activeTab === 'بيانات الشركة' && (
          <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-8 animate-fade-in">
            <form onSubmit={handleSaveCompany}>
              {/* Form Top Row: Title on Right, Save Button on Left */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                {/* Left: Button حفظ التغييرات - Rectangle 222 in XD */}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FB8731] hover:bg-[#E06F1B] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <span>حفظ التغييرات</span>
                  <Folder className="w-4 h-4" />
                </button>

                {/* Right: Section Title */}
                <div>
                  <h2 className="text-xl font-black text-[#011222]">بيانات الشركة</h2>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">معلومات المنشأة والمسؤول الرسمي المعتمد</p>
                </div>
              </div>

              {/* 2-Column Form Fields (3 Rows) matching XD */}
              <div className="space-y-6 pt-6">
                {/* Row 1: اسم الشركة & اسم المسؤول */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: اسم المسؤول */}
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      اسم المسؤول
                    </label>
                    <input
                      type="text"
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  {/* Right Column: اسم الشركة */}
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      اسم الشركة
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>
                </div>

                {/* Row 2: رقم الهاتف & البريد الإلكتروني */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: رقم الهاتف */}
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  {/* Right Column: البريد الإلكتروني */}
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>
                </div>

                {/* Row 3: رقم الرخصة التجارية & المقر الرئيسي */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: رقم الرخصة التجارية */}
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      رقم الرخصة التجارية
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  {/* Right Column: المقر الرئيسي */}
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      المقر الرئيسي
                    </label>
                    <input
                      type="text"
                      name="headquarters"
                      value={formData.headquarters}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>
                </div>

                {/* Row 4: الرقم الضريبي & سنة التأسيس */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      سنة التأسيس والنشاط
                    </label>
                    <input
                      type="text"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">
                      الرقم الضريبي الموحد (VAT)
                    </label>
                    <input
                      type="text"
                      name="taxNumber"
                      value={formData.taxNumber}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB 2: الخدمات و المناطق                                    */}
        {/* ========================================================= */}
        {activeTab === 'الخدمات و المناطق' && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Offered Logistics Services */}
            <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <span className="text-xs font-bold text-[#FB8731] bg-[#FFF3EA] px-3.5 py-1.5 rounded-xl">
                  {services.filter((s) => s.enabled).length} خدمات مفعلة حالياً
                </span>
                <div className="text-right">
                  <h2 className="text-lg font-black text-[#011222]">الخدمات اللوجستية المعتمدة</h2>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    حدد الخدمات التي تقدمها شركتك لاستقبال طلبات عروض الأسعار المطابقة لها
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((srv) => {
                  const IconComp = srv.icon
                  return (
                    <div
                      key={srv.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        srv.enabled
                          ? 'border-[#FB8731]/40 bg-[#FFFDFB] shadow-xs'
                          : 'border-gray-200 bg-gray-50/60 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        {/* Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleService(srv.id)}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            srv.enabled ? 'bg-[#FB8731]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              srv.enabled ? 'right-6' : 'right-1'
                            }`}
                          />
                        </button>

                        {/* Icon */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            srv.enabled
                              ? 'bg-[#FFF3EA] text-[#FB8731]'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="mt-4 text-right">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#64748B] bg-gray-100 px-2 py-0.5 rounded-md">
                            {srv.tag}
                          </span>
                          <h3 className="text-sm font-black text-[#011222]">{srv.title}</h3>
                        </div>
                        <p className="text-xs text-[#64748B] font-medium mt-2 leading-relaxed">
                          {srv.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 2. Ports and Terminals Coverage */}
            <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPortModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#011222] hover:bg-[#022344] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منفذ تغطية</span>
                </button>

                <div className="text-right">
                  <h2 className="text-lg font-black text-[#011222]">مناطق التغطية والمنافذ الجمركية</h2>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    الموانئ والمطارات والمنافذ الحدودية التي تنشط فيها فرق عملياتك
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ports.map((port) => (
                  <div
                    key={port.id}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-[#FB8731]/40 hover:shadow-xs transition-all bg-white relative group text-right flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => handleDeletePort(port.id)}
                          title="حذف المنطقة"
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-[#EBF5FE] text-[#0284C7] flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-sm font-black text-[#011222] mt-3">{port.name}</h3>
                      <p className="text-xs text-[#64748B] mt-1">{port.region}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#009F65] bg-[#E6F9F0] px-2.5 py-1 rounded-lg text-[10px]">
                        {port.status}
                      </span>
                      <span className="text-[#64748B] font-medium text-[11px]">{port.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Fleet & Operations Overview */}
            <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-4">
              <div className="text-right">
                <h2 className="text-lg font-black text-[#011222]">طاقة الأسطول والمعدات</h2>
                <p className="text-xs text-[#64748B] font-medium mt-0.5">
                  بيانات سعة النقل والمقطورات المعتمدة لدى منصة ميناء
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div className="p-5 rounded-2xl bg-[#FFFDFB] border border-[#FB8731]/30 text-right">
                  <span className="text-2xl font-black text-[#FB8731]">18</span>
                  <div className="text-xs font-black text-[#011222] mt-1">تريلات ستائر وحاويات</div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">مخصصة لنقل الحاويات 20 و 40 قدم</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#009F65]/30 text-right">
                  <span className="text-2xl font-black text-[#009F65]">8</span>
                  <div className="text-xs font-black text-[#011222] mt-1">شاحنات مبردة ومجمدة</div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">شحن الأغذية والأدوية بنظام حراري دقيق</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F0F9FF] border border-[#0284C7]/30 text-right">
                  <span className="text-2xl font-black text-[#0284C7]">12</span>
                  <div className="text-xs font-black text-[#011222] mt-1">سطحات لنقل البضائع الثقيلة</div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">نقل المعدات الصناعية والحديد والمشاريع</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Modal: Add New Port */}
        {showPortModal && (
          <div className="fixed inset-0 z-50 bg-[#011222]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] max-w-md w-full p-7 shadow-2xl space-y-5 animate-scale-in text-right">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <button onClick={() => setShowPortModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base font-black text-[#011222]">إضافة منفذ أو منطقة تغطية جديدة</h3>
              </div>

              <form onSubmit={handleAddPort} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">اسم المنفذ أو الميناء</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ميناء ينبع التجاري"
                    value={newPort.name}
                    onChange={(e) => setNewPort({ ...newPort, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">المنطقة / الدولة</label>
                  <input
                    type="text"
                    placeholder="مثال: منطقة المدينة المنورة، السعودية"
                    value={newPort.region}
                    onChange={(e) => setNewPort({ ...newPort, region: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#011222]">نوع المنفذ</label>
                  <select
                    value={newPort.type}
                    onChange={(e) => setNewPort({ ...newPort, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#FB8731]"
                  >
                    <option value="ميناء بحري">ميناء بحري تجاري</option>
                    <option value="منفذ جوي">منفذ جوي (مطار شحن)</option>
                    <option value="منفذ بري">منفذ حدودي بري</option>
                    <option value="مستودع جمركي">مستودع إيداع جمركي</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPortModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#FB8731] hover:bg-[#E06F1B] text-white text-xs font-bold shadow-md shadow-orange-500/20"
                  >
                    إضافة وتفعيل
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: الإشعارات                                           */}
        {/* ========================================================= */}
        {activeTab === 'الإشعارات' && (
          <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-8 animate-fade-in">
            <form onSubmit={handleSaveNotifications}>
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FB8731] hover:bg-[#E06F1B] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <span>حفظ التفضيلات</span>
                  <Save className="w-4 h-4" />
                </button>

                <div className="text-right">
                  <h2 className="text-xl font-black text-[#011222]">تفضيلات الإشعارات والتنبيهات</h2>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    تحكم بطريقة ووقت وصول تنبيهات المناقصات ومتابعة الشحنات والعمليات الميدانية
                  </p>
                </div>
              </div>

              {/* 1. Alert Channels */}
              <div className="pt-6 space-y-4">
                <h3 className="text-sm font-black text-[#011222] text-right">قنوات التنبيه الأساسية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'emailAlerts', title: 'البريد الإلكتروني', desc: 'ملخصات يومية وعروض أسعار' },
                    { key: 'smsAlerts', title: 'رسائل SMS', desc: 'تنبيهات فورية للشحنات العاجلة' },
                    { key: 'whatsappAlerts', title: 'واتساب للأعمال', desc: 'إشعارات قبول العروض والفسح' },
                    { key: 'inAppAlerts', title: 'إشعارات المنصة', desc: 'جرس التنبيهات المباشر داخل النظام' }
                  ].map((ch) => (
                    <div
                      key={ch.key}
                      className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between text-right"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setNotifications({ ...notifications, [ch.key]: !notifications[ch.key] })
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          notifications[ch.key] ? 'bg-[#FB8731]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            notifications[ch.key] ? 'right-6' : 'right-1'
                          }`}
                        />
                      </button>

                      <div>
                        <div className="text-xs font-bold text-[#011222]">{ch.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{ch.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. RFQ & Tender Alerts */}
              <div className="pt-8 border-t border-gray-100 space-y-4">
                <h3 className="text-sm font-black text-[#011222] text-right">
                  تنبيهات طلبات الأسعار والمناقصات (RFQ)
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      key: 'newRfqMatches',
                      title: 'إشعار بطلب عرض سعر جديد مطابق لخدماتك ومناطقك',
                      desc: 'يصلك فور طرح المستورد لطلب شحن أو تخليص جمركي في منافذك المعتمدة'
                    },
                    {
                      key: 'bidAccepted',
                      title: 'تنبيه بقبول عرض السعر الخاص بك من المستورد',
                      desc: 'إشعار مباشر وفوري يتيح لك بدء تجهيز الشحنة ومراجعة البوالص'
                    },
                    {
                      key: 'bidExpiring',
                      title: 'تنبيه قبل انتهاء مهلة تقديم العروض للمناقصات المفتوحة (24 ساعة)',
                      desc: 'تذكير ذكي لضمان عدم تفويت الفرص التجارية المتاحة'
                    }
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-[#FAFAFA] flex items-center justify-between text-right"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setNotifications({ ...notifications, [item.key]: !notifications[item.key] })
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          notifications[item.key] ? 'bg-[#FB8731]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            notifications[item.key] ? 'right-6' : 'right-1'
                          }`}
                        />
                      </button>

                      <div className="pr-4">
                        <div className="text-xs font-bold text-[#011222]">{item.title}</div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Operational Alerts */}
              <div className="pt-8 border-t border-gray-100 space-y-4">
                <h3 className="text-sm font-black text-[#011222] text-right">
                  تنبيهات العمليات الميدانية والجمارك
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      key: 'customsClearance',
                      title: 'إشعارات صدور الفسوحات الجمركية وبيان الصرف',
                      desc: 'تحديثات مباشرة من نظام المنافذ والموانئ عند اكتمال التدقيق الجمركي'
                    },
                    {
                      key: 'shipmentTracking',
                      title: 'تحديثات حركة الشاحنات ومواعيد التسليم للمستودعات',
                      desc: 'إشعار لحظي عند خروج الشاحنة من الميناء ووصولها إلى وجهة العميل'
                    },
                    {
                      key: 'emergencyDelays',
                      title: 'تنبيهات الطوارئ والملاحظات الجمركية والتأخير',
                      desc: 'تنبيه فوري عند طلب جهة الجمارك مستندات إضافية أو إعادة معاينة'
                    }
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-[#FAFAFA] flex items-center justify-between text-right"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setNotifications({ ...notifications, [item.key]: !notifications[item.key] })
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          notifications[item.key] ? 'bg-[#FB8731]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            notifications[item.key] ? 'right-6' : 'right-1'
                          }`}
                        />
                      </button>

                      <div className="pr-4">
                        <div className="text-xs font-bold text-[#011222]">{item.title}</div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB 4: الأمان                                              */}
        {/* ========================================================= */}
        {activeTab === 'الأمان' && (
          <div className="space-y-6 animate-fade-in">
            {/* Password Update Card */}
            <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
                  آخر تحديث منذ 45 يوماً
                </span>
                <div className="text-right">
                  <h2 className="text-lg font-black text-[#011222]">تغيير كلمة المرور</h2>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    احرص على استخدام كلمة مرور قوية تتضمن أحرفاً كبيرة وصغيرة وأرقاماً
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityForm.currentPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                      }
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityForm.newPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, newPassword: e.target.value })
                      }
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>

                  <div className="text-right space-y-1.5">
                    <label className="block text-xs font-bold text-[#011222]">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                      }
                      className="w-full px-5 py-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-mono font-bold text-[#011222] focus:outline-none focus:ring-2 focus:ring-[#FB8731] text-right"
                    />
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FB8731] hover:bg-[#E06F1B] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    <span>تحديث كلمة المرور</span>
                    <Key className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </section>

            {/* Two-Factor Authentication (2FA) */}
            <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => showToast('إعدادات المصادقة الثنائية محدثة ومفعلة')}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#011222] hover:bg-gray-50 transition-colors"
                >
                  إعادة تهيئة 2FA
                </button>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-[10px] font-bold text-[#009F65] bg-[#E6F9F0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        مُفعل بنجاح
                      </span>
                      <h3 className="text-sm font-black text-[#011222]">
                        المصادقة الثنائية (2FA)
                      </h3>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      تأمين حسابك عبر رمز تحقق يتم توليده في تطبيق Google Authenticator عند كل تسجيل دخول
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#E6F9F0] text-[#009F65] flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </section>

            {/* Active Sessions */}
            <section className="bg-white rounded-[25px] shadow-xs border border-gray-100 p-8 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => showToast('تم تسجيل الخروج من كافة الأجهزة الأخرى بنجاح!')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  تسجيل الخروج من كافة الأجهزة الأخرى
                </button>

                <div className="text-right">
                  <h3 className="text-base font-black text-[#011222]">الأجهزة والجلسات النشطة</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">الأجهزة المسجلة حالياً التي تملك صلاحية الوصول إلى الحساب</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Session 1: Current PC */}
                <div className="p-4 rounded-2xl border border-green-200/60 bg-[#F0FDF4] flex items-center justify-between text-right">
                  <span className="text-[10px] font-bold text-[#009F65] bg-white border border-[#009F65]/30 px-2.5 py-1 rounded-full">
                    الجهاز الحالي (نشط الآن)
                  </span>

                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs font-black text-[#011222]">متصفح Chrome على نظام Windows 11</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5 font-mono">
                        دبي، الإمارات العربية المتحدة • IP: 194.170.82.14
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-green-200 flex items-center justify-center text-[#009F65]">
                      <Laptop className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Session 2: Mobile */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between text-right">
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    قبل 3 ساعات
                  </span>

                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs font-black text-[#011222]">تطبيق Meynaa Partners على iPhone 15 Pro</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5 font-mono">
                        الرياض، المملكة العربية السعودية • IP: 89.144.112.9
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                      <Smartphone className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

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
