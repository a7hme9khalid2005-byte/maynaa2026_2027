import { useState } from 'react'
import ImporterSidebar from '../../../components/dashboard/ImporterSidebar'
import DashboardFooterBar from '../../../components/common/DashboardFooterBar'
import { useNotifications } from '../../../context/NotificationContext'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import {
  Settings as SettingsIcon,
  Search,
  Bell,
  Building2,
  MapPin,
  Shield,
  Save,
  Check,
  Ship,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Key,
  Smartphone,
  CheckCircle2,
  Mail,
  MessageSquare,
  X,
  Laptop
} from 'lucide-react'

export default function ImporterSettingsPage() {
  const { openNotifications } = useNotifications()
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoSarah = !currentUser || currentUser.email === 'importer@meynaa.com'

  const [activeTab, setActiveTab] = useState('بيانات الشركة')
  const [saved, setSaved] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Company Profile Form Data
  const [formData, setFormData] = useState(() => ({
    managerName: isDemoSarah ? 'سارة الزاهرني' : (currentUser?.fullName || 'صاحب الحساب'),
    jobTitle: isDemoSarah ? 'مديرة سلسلة التوريد' : 'صاحب المنشأة والمفوض بالتوقيع',
    companyName: isDemoSarah ? 'مجموعة الريادة للمقاولات' : (currentUser?.companyName || 'منشأة تجارية'),
    businessSector: isDemoSarah ? 'مواد بناء و مقاولات' : (currentUser?.businessType || 'أغذية ومشروبات وتجارة'),
    email: isDemoSarah ? 'S.zahrani@riyada-group.sa' : (currentUser?.email || ''),
    phone: isDemoSarah ? '+966 55 431 8820' : (currentUser?.phone || ''),
    headquarters: isDemoSarah ? 'دبي _ الإمارات العربية المتحدة' : (currentUser?.companyAddress || 'غزة - فلسطين'),
    annualImport: isDemoSarah ? '4.2M$' : '0$'
  }))

  // Saved Addresses
  const [addresses, setAddresses] = useState(() => {
    if (isDemoSarah) {
      return [
        {
          id: 'ADDR-1',
          name: 'مستودع الرياض اللوجستي المركزي',
          type: 'المستودع الرئيسي للتفريغ والتخزين',
          city: 'الرياض',
          address: 'حي السلي، مخرج 18، شارع هارون الرشيد',
          recipient: 'عبدالله السبيعي',
          phone: '+966 50 123 4567',
          isDefault: true
        },
        {
          id: 'ADDR-2',
          name: 'مستودع ميناء جدة الإسلامي',
          type: 'مستودع تخزين مؤقت وقريب من الميناء',
          city: 'جدة',
          address: 'المنطقة الجمركية المساندة 4، طريق الميناء',
          recipient: 'فيصل الغامدي',
          phone: '+966 54 876 5432',
          isDefault: false
        },
        {
          id: 'ADDR-3',
          name: 'فرع مستودعات الدمام الصناعية',
          type: 'مركز التوزيع الإقليمي للمنطقة الشرقية',
          city: 'الدمام',
          address: 'المدينة الصناعية الثانية، طريق الظهران الجبيل',
          recipient: 'خالد المطيري',
          phone: '+966 56 333 9988',
          isDefault: false
        }
      ]
    }
    return [
      {
        id: 'ADDR-1',
        name: currentUser?.companyName ? `مقر ${currentUser.companyName} الرئيسي` : 'المقر اللوجستي الرئيسي',
        type: 'المقر الرئيسي ونقطة الاستلام والتوزيع',
        city: currentUser?.companyAddress || 'المقر الرئيسي',
        address: currentUser?.companyAddress || 'العنوان المسجل في ملف المنشأة',
        recipient: currentUser?.fullName || 'صاحب الحساب',
        phone: currentUser?.phone || '',
        isDefault: true
      }
    ]
  })

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddr, setNewAddr] = useState({
    name: '',
    type: 'مستودع تفريغ',
    city: 'الرياض',
    address: '',
    recipient: '',
    phone: ''
  })

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: true,
    whatsappAlerts: true,
    inAppAlerts: true,
    shipmentStatus: true,
    portArrival: true,
    delayAlerts: true,
    newRfqBids: true,
    docApproval: true,
    invoicesAndBilling: true,
    monthlyReports: false
  })

  // Security Form
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSaveCompany = (e) => {
    e.preventDefault()
    setSaved(true)
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        fullName: formData.managerName,
        companyName: formData.companyName,
        companyAddress: formData.headquarters,
        phone: formData.phone,
        businessType: formData.businessSector
      }
      localStorage.setItem('meynaa_user', JSON.stringify(updatedUser))
      window.dispatchEvent(new Event('storage'))
    }
    showToast('تم حفظ بيانات المنشأة بنجاح!')
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id
      }))
    )
    showToast('تم تعيين العنوان كافتراضي بنجاح')
  }

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
    showToast('تم حذف العنوان بنجاح')
  }

  const handleAddAddressSubmit = (e) => {
    e.preventDefault()
    if (!newAddr.name || !newAddr.address) return

    const newId = `ADDR-${addresses.length + 1}`
    setAddresses([
      ...addresses,
      {
        ...newAddr,
        id: newId,
        isDefault: addresses.length === 0
      }
    ])
    setShowAddressModal(false)
    setNewAddr({
      name: '',
      type: 'مستودع تفريغ',
      city: 'الرياض',
      address: '',
      recipient: '',
      phone: ''
    })
    showToast('تمت إضافة العنوان الجديد بنجاح!')
  }

  const handleSaveNotifications = () => {
    showToast('تم حفظ تفضيلات الإشعارات بنجاح!')
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    if (!securityForm.newPassword || !securityForm.currentPassword) {
      showToast('يرجى تعبئة الحقول المطلوبة')
      return
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast('كلمتا المرور غير متطابقتين!')
      return
    }
    setSecurityForm({
      ...securityForm,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    showToast('تم تحديث كلمة المرور بنجاح!')
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
      <ImporterSidebar activePath="/importer/settings" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[320px] p-8 space-y-6 relative z-10">
        {/* Top Header Bar: Title on Right, Search & Bell on Left */}
        <header className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-xs flex items-center justify-between">
          {/* Right: Title & Subtitle + Orange Settings Icon */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl border border-[#FB8731]/30 bg-[#FFF7ED] flex items-center justify-center text-[#FB8731]">
              <SettingsIcon className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#011222]">الإعدادات</h1>
              <p className="text-[11px] text-gray-400 font-medium">بيانات حسابك وتفضيلاتك</p>
            </div>
          </div>

          {/* Left: Search input & Notifications bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="...ابحث"
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

        {/* Feedback Alert Toast */}
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

        {/* User Profile Banner matching screenshot */}
        <section className="bg-[#011222] rounded-[24px] px-8 py-5 text-white flex items-center justify-between relative overflow-hidden shadow-md min-h-[105px]">
          {/* Bottom Orange Curved Wave Accent */}
          <svg
            className="absolute bottom-0 right-[260px] w-96 h-28 pointer-events-none"
            viewBox="0 0 320 80"
            fill="none"
          >
            <path
              d="M 0 80 C 60 10 180 10 320 80 Z"
              fill="#FB8731"
            />
          </svg>

          {/* Right: User Avatar & Info (Avatar on Right, Text on Left) */}
          <div className="flex items-center gap-4 relative z-10 text-right">
            {/* Orange Square Avatar with 'سار' */}
            <div className="w-14 h-14 rounded-2xl bg-[#FB8731] flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
              سار
            </div>

            <div>
              <h2 className="text-lg font-black text-white block">
                {formData.managerName}
              </h2>
              <span className="text-white/75 text-xs font-bold block mt-0.5">
                {formData.jobTitle} -{formData.companyName}
              </span>
              <span className="text-white/50 text-[11px] font-sans block mt-0.5">
                s.zahrani@riyada-group.sa
              </span>
            </div>
          </div>

          {/* Left: Enterprise Badge Pill */}
          <div className="relative z-10">
            <span className="bg-[#FB8731] text-white font-bold text-xs px-6 py-2 rounded-2xl shadow-xs inline-block font-sans">
              Enterprise
            </span>
          </div>
        </section>

        {/* Settings Tabs Pill: Right-aligned starting with 'بيانات الشركة' */}
        <section className="flex justify-start">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-1 flex items-center shadow-xs flex-wrap gap-1">
            {/* Tab 1: بيانات الشركة */}
            <button
              onClick={() => setActiveTab('بيانات الشركة')}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'بيانات الشركة'
                  ? 'bg-[#FB8731] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#011222]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>بيانات الشركة</span>
            </button>

            {/* Tab 2: العناوين المحفوظة */}
            <button
              onClick={() => setActiveTab('العناوين المحفوظة')}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'العناوين المحفوظة'
                  ? 'bg-[#FB8731] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#011222]'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>العناوين المحفوظة</span>
            </button>

            {/* Tab 3: الإشعارات */}
            <button
              onClick={() => setActiveTab('الإشعارات')}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'الإشعارات'
                  ? 'bg-[#FB8731] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#011222]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>الإشعارات</span>
            </button>

            {/* Tab 4: الأمان */}
            <button
              onClick={() => setActiveTab('الأمان')}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'الأمان'
                  ? 'bg-[#FB8731] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#011222]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>الأمان</span>
            </button>
          </div>
        </section>

        {/* TAB 1: بيانات الشركة Form */}
        {activeTab === 'بيانات الشركة' && (
          <section className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-xs text-right animate-fade-in">
            <form onSubmit={handleSaveCompany} className="space-y-6">
              {/* Header Row: Title on Right, Save Button on Left */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <button
                  type="submit"
                  className="bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold text-xs px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs transition-colors"
                >
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{saved ? 'تم الحفظ بنجاح' : 'حفظ التغييرات'}</span>
                </button>

                <div>
                  <h3 className="text-xl font-black text-[#011222]">بيانات الشركة</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">معلومات المنشأة والمسؤول المعني بالتخليص والاستيراد</p>
                </div>
              </div>

              {/* Form Fields: 4 Rows x 2 Columns matching screenshot */}
              <div className="space-y-5">
                {/* Row 1: اسم المسؤول (Right) & المسمى الوظيفي (Left) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      المسمى الوظيفي
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      اسم المسؤول
                    </label>
                    <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: اسم الشركة (Right) & قطاع النشاط (Left) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      قطاع النشاط
                    </label>
                    <input
                      type="text"
                      value={formData.businessSector}
                      onChange={(e) => setFormData({ ...formData, businessSector: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      اسم الشركة
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: البريد الإلكتروني (Right) & رقم الهاتف (Left) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold font-sans text-right focus:outline-none focus:border-[#FB8731] transition-colors"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold font-sans text-right focus:outline-none focus:border-[#FB8731] transition-colors"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Row 4: المقر الرئيسي (Right) & حجم الاستيراد السنوي (Left) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      حجم الاستيراد السنوي
                    </label>
                    <input
                      type="text"
                      value={formData.annualImport}
                      onChange={(e) => setFormData({ ...formData, annualImport: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold font-sans text-right focus:outline-none focus:border-[#FB8731] transition-colors"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-black mb-2">
                      المقر الرئيسي
                    </label>
                    <input
                      type="text"
                      value={formData.headquarters}
                      onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                      className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* TAB 2: العناوين المحفوظة */}
        {activeTab === 'العناوين المحفوظة' && (
          <section className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-xs text-right space-y-6 animate-fade-in">
            {/* Header with Title and Add Address Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold text-xs px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>إضافة عنوان جديد</span>
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>

              <div>
                <h3 className="text-xl font-black text-[#011222]">العناوين ومواقع الاستلام والتفريغ</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  إدارة عناوين المستودعات والموانئ لاستخدامها السريع في طلبات عروض الأسعار والشحنات
                </p>
              </div>
            </div>

            {/* Addresses Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                    addr.isDefault
                      ? 'border-[#FB8731] bg-[#FFFBF8] shadow-sm'
                      : 'border-gray-200/80 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon & Default Badge */}
                    <div className="flex items-center justify-between">
                      {addr.isDefault ? (
                        <span className="bg-[#FB8731] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                          العنوان الافتراضي
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] text-gray-400 hover:text-[#FB8731] font-bold transition-colors"
                        >
                          تعيين كافتراضي
                        </button>
                      )}

                      <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] border border-[#FB8731]/30 flex items-center justify-center text-[#FB8731]">
                        <MapPin className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Address Title & Type */}
                    <div>
                      <h4 className="text-base font-black text-[#011222]">{addr.name}</h4>
                      <span className="text-[11px] text-gray-400 font-medium block mt-0.5">{addr.type}</span>
                    </div>

                    {/* Address Detail Info */}
                    <div className="space-y-1.5 pt-2 text-xs text-gray-600 border-t border-gray-100">
                      <p className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800">المدينة:</span>
                        <span>{addr.city}</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <span className="font-bold text-gray-800 shrink-0">العنوان:</span>
                        <span className="leading-relaxed">{addr.address}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800">المستلم:</span>
                        <span>{addr.recipient} ({addr.phone})</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="حذف العنوان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showToast('خاصية تعديل العنوان متوفرة')}
                      className="text-xs font-bold text-[#FB8731] hover:underline flex items-center gap-1"
                    >
                      <span>تعديل</span>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: الإشعارات */}
        {activeTab === 'الإشعارات' && (
          <section className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-xs text-right space-y-8 animate-fade-in">
            {/* Header Row */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold text-xs px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التفضيلات</span>
              </button>

              <div>
                <h3 className="text-xl font-black text-[#011222]">تفضيلات الإشعارات والتنبيهات</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  تحكم بالقنوات ونوعية التنبيهات التي ترغب باستلامها فورياً
                </p>
              </div>
            </div>

            {/* Category 1: قنوات استلام التنبيهات */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#011222]">
                <Globe className="w-4 h-4 text-[#FB8731]" />
                <h4>قنوات الإشعارات النشطة</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between hover:border-gray-300 transition-colors">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailUpdates}
                      onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#011222] block">البريد الإلكتروني</span>
                      <span className="text-[11px] text-gray-400 font-sans">{formData.email}</span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0284C7] flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* SMS */}
                <div className="p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between hover:border-gray-300 transition-colors">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.smsAlerts}
                      onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#011222] block">رسائل الجوال SMS</span>
                      <span className="text-[11px] text-gray-400 font-sans">{formData.phone}</span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-green-50 text-[#009F65] flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between hover:border-gray-300 transition-colors">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.whatsappAlerts}
                      onChange={(e) => setNotifications({ ...notifications, whatsappAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#011222] block">واتساب للأعمال WhatsApp</span>
                      <span className="text-[11px] text-gray-400">تنبيهات مباشرة وموجزة</span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* In-app */}
                <div className="p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between hover:border-gray-300 transition-colors">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.inAppAlerts}
                      onChange={(e) => setNotifications({ ...notifications, inAppAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#011222] block">إشعارات النظام في الموقع</span>
                      <span className="text-[11px] text-gray-400">أيقونة الجرس والشارات الفورية</span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FB8731] flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category 2: إشعارات الشحنات والمستندات */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-black text-[#011222]">
                <Ship className="w-4 h-4 text-[#FB8731]" />
                <h4>أحداث الشحن والتخليص الجمركي</h4>
              </div>

              <div className="space-y-3 bg-[#F8FAFC] p-5 rounded-2xl border border-gray-200/70">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.shipmentStatus}
                      onChange={(e) => setNotifications({ ...notifications, shipmentStatus: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">تحديثات حركة الشحنة (تتبع مستمر)</span>
                    <span className="text-[11px] text-gray-400">إشعار عند إقلاع السفينة، دخول الحاويات، أو تغيير مسار الشحن</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.portArrival}
                      onChange={(e) => setNotifications({ ...notifications, portArrival: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">وصول الشحنة لميناء الوصول وبدء الفسح الجمركي</span>
                    <span className="text-[11px] text-gray-400">تنبيه فوري عند رسو السفينة وتفريغ الحاويات</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.delayAlerts}
                      onChange={(e) => setNotifications({ ...notifications, delayAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">تنبيهات الطوارئ والتأخير في مواعيد التسليم (ETA)</span>
                    <span className="text-[11px] text-gray-400">إشعار مبكر في حال حدوث أي تقلبات جوية أو ازدحام في الموانئ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category 3: عروض الأسعار والمالية */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-black text-[#011222]">
                <Shield className="w-4 h-4 text-[#FB8731]" />
                <h4>عروض الأسعار والمدفوعات</h4>
              </div>

              <div className="space-y-3 bg-[#F8FAFC] p-5 rounded-2xl border border-gray-200/70">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.newRfqBids}
                      onChange={(e) => setNotifications({ ...notifications, newRfqBids: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">استلام عروض أسعار جديدة (RFQ)</span>
                    <span className="text-[11px] text-gray-400">إشعار عند تقديم مزود خدمة لعرض سعر على طلباتك</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.docApproval}
                      onChange={(e) => setNotifications({ ...notifications, docApproval: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">اعتماد المستندات أو طلب تعديلها</span>
                    <span className="text-[11px] text-gray-400">تنبيه عند اعتماد بوالص الشحن أو الفواتير الجمركية</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.monthlyReports}
                      onChange={(e) => setNotifications({ ...notifications, monthlyReports: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB8731]"></div>
                  </label>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">التقرير الشهري للإنفاق والوفورات</span>
                    <span className="text-[11px] text-gray-400">ملخص تحليلي شهري مفصل عبر الإيميل</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: الأمان */}
        {activeTab === 'الأمان' && (
          <section className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-xs text-right space-y-8 animate-fade-in">
            {/* Header */}
            <div className="pb-4 border-b border-gray-100">
              <h3 className="text-xl font-black text-[#011222]">إعدادات الأمان وتسجيل الدخول</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                حماية حسابك التجاري وتشفير بيانات الدخول وإدارة الجلسات النشطة
              </p>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-black text-[#011222] mb-1">
                <Lock className="w-4 h-4 text-[#FB8731]" />
                <h4>تغيير كلمة المرور</h4>
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-black mb-2">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-black mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                    className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-black mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    className="w-full bg-white border border-gray-200/90 rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#FB8731] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#FB8731] hover:bg-[#E06F1B] text-white font-bold text-xs px-6 py-2.5 rounded-2xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>تحديث كلمة المرور</span>
                </button>
              </div>
            </form>

            {/* Two-Factor Authentication Card */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-black text-[#011222] mb-3">
                <Shield className="w-4 h-4 text-[#009F65]" />
                <h4>التحقق بخطوتين (2FA)</h4>
              </div>

              <div className="bg-[#E6F9F0] border border-[#009F65]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => showToast('إعدادات التحقق بخطوتين قيد التفعيل')}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-[#011222] font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  إدارة طرق التحقق
                </button>

                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs font-bold text-[#009F65]">مُفعل بنجاح لحماية حسابك</span>
                    <CheckCircle2 className="w-4 h-4 text-[#009F65]" />
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    يتم طلب رمز تحقق مكون من 5 أرقام عبر SMS عند تسجيل الدخول من جهاز جديد
                  </p>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => showToast('تم إنهاء الجلسات الأخرى بنجاح')}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  تسجيل الخروج من كافة الأجهزة الأخرى
                </button>

                <div className="flex items-center gap-2 text-sm font-black text-[#011222]">
                  <Laptop className="w-4 h-4 text-[#FB8731]" />
                  <h4>الجلسات والأجهزة النشطة</h4>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between bg-gray-50/60">
                  <span className="bg-[#009F65]/10 text-[#009F65] text-[10px] font-black px-2.5 py-1 rounded-full">
                    الجلسة الحالية
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">Windows PC - متصفح Google Chrome</span>
                    <span className="text-[11px] text-gray-400 font-mono">الرياض، السعودية • نشط الآن</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between bg-white">
                  <span className="text-xs text-gray-400 font-mono">منذ ساعتين</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#011222] block">Apple iPhone 15 Pro - متصفح Safari</span>
                    <span className="text-[11px] text-gray-400 font-mono">جدة، السعودية</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Modal: إضافة عنوان جديد */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl relative animate-scale-up">
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute left-6 top-6 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-[#011222] mb-1">إضافة عنوان وموقع جديد</h3>
              <p className="text-xs text-gray-400 mb-6">أدخل تفاصيل المستودع أو موقع الاستلام لاستخدامه في شحناتك</p>

              <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-gray-600 mb-1">اسم الموقع / المستودع</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مستودع الشارقة المركزي"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">المدينة</label>
                    <input
                      type="text"
                      required
                      placeholder="الرياض، جدة، دبي..."
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">نوع الموقع</label>
                    <select
                      value={newAddr.type}
                      onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                    >
                      <option value="مستودع تفريغ رئيسي">مستودع تفريغ رئيسي</option>
                      <option value="مستودع تخزين مؤقت">مستودع تخزين مؤقت</option>
                      <option value="مركز توزيع إقليمي">مركز توزيع إقليمي</option>
                      <option value="منطقة جمركية حرة">منطقة جمركية حرة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">العنوان التفصيلي</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الشارع، رقم المبنى، الرمز البريدي"
                    value={newAddr.address}
                    onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">رقم هاتف المستلم</label>
                    <input
                      type="text"
                      required
                      placeholder="+966 50 000 0000"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731] font-sans text-right"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">اسم مسؤول المستودع</label>
                    <input
                      type="text"
                      required
                      placeholder="اسم المستلم في الموقع"
                      value={newAddr.recipient}
                      onChange={(e) => setNewAddr({ ...newAddr, recipient: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FB8731]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FB8731] hover:bg-[#E06F1B] text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    حفظ العنوان
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
    </div>
  )
}
