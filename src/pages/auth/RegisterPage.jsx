import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLegalModal } from '../../context/LegalModalContext'
import {
  UserPlus,
  ShieldCheck,
  Zap,
  Users,
  Check,
  ArrowLeft,
  Building2,
  Ship,
  UploadCloud,
  Globe,
  MapPin,
  Lock,
  Mail,
  User
} from 'lucide-react'

// قائمة شاملة بالدول مع مقدمة الاتصال والعلم
const countriesList = [
  { code: 'SA', name: 'المملكة العربية السعودية', dial: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', dial: '+971', flag: '🇦🇪' },
  { code: 'EG', name: 'جمهورية مصر العربية', dial: '+20', flag: '🇪🇬' },
  { code: 'KW', name: 'دولة الكويت', dial: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'دولة قطر', dial: '+974', flag: '🇶🇦' },
  { code: 'OM', name: 'سلطنة عمان', dial: '+968', flag: '🇴🇲' },
  { code: 'BH', name: 'مملكة البحرين', dial: '+973', flag: '🇧🇭' },
  { code: 'JO', name: 'المملكة الأردنية الهاشمية', dial: '+962', flag: '🇯🇴' },
  { code: 'IQ', name: 'جمهورية العراق', dial: '+964', flag: '🇮🇶' },
  { code: 'PS', name: 'دولة فلسطين', dial: '+970', flag: '🇵🇸' },
  { code: 'LB', name: 'الجمهورية اللبنانية', dial: '+961', flag: '🇱🇧' },
  { code: 'SY', name: 'الجمهورية العربية السورية', dial: '+963', flag: '🇸🇾' },
  { code: 'YE', name: 'الجمهورية اليمنية', dial: '+967', flag: '🇾🇪' },
  { code: 'MA', name: 'المملكة المغربية', dial: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'الجمهورية الجزائرية', dial: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'الجمهورية التونسية', dial: '+216', flag: '🇹🇳' },
  { code: 'LY', name: 'دولة ليبيا', dial: '+218', flag: '🇱🇾' },
  { code: 'SD', name: 'جمهورية السودان', dial: '+249', flag: '🇸🇩' },
  { code: 'TR', name: 'الجمهورية التركية', dial: '+90', flag: '🇹🇷' },
  { code: 'CN', name: 'جمهورية الصين الشعبية', dial: '+86', flag: '🇨🇳' },
  { code: 'DE', name: 'جمهورية ألمانيا الاتحادية', dial: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'المملكة المتحدة', dial: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'الولايات المتحدة الأمريكية', dial: '+1', flag: '🇺🇸' },
  { code: 'IN', name: 'جمهورية الهند', dial: '+91', flag: '🇮🇳' },
  { code: 'IT', name: 'الجمهورية الإيطالية', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'مملكة إسبانيا', dial: '+34', flag: '🇪🇸' },
  { code: 'FR', name: 'الجمهورية الفرنسية', dial: '+33', flag: '🇫🇷' },
  { code: 'NL', name: 'مملكة هولندا', dial: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'مملكة بلجيكا', dial: '+32', flag: '🇧🇪' },
  { code: 'JP', name: 'اليابان', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'كوريا الجنوبية', dial: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'جمهورية سنغافورة', dial: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'ماليزيا', dial: '+60', flag: '🇲🇾' },
  { code: 'AU', name: 'أستراليا', dial: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'كندا', dial: '+1', flag: '🇨🇦' },
  { code: 'BR', name: 'جمهورية البرازيل', dial: '+55', flag: '🇧🇷' },
  { code: 'RU', name: 'روسيا الاتحادية', dial: '+7', flag: '🇷🇺' },
  { code: 'ZA', name: 'جنوب أفريقيا', dial: '+27', flag: '🇿🇦' },
  { code: 'OTHER', name: 'دولة أخرى', dial: '+00', flag: '🌐' }
]

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('importer') // 'importer' | 'provider'
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedCountryCode, setSelectedCountryCode] = useState('SA')
  const navigate = useNavigate()
  const { openLegalModal } = useLegalModal()

  // Selected country object
  const currentCountry =
    countriesList.find((c) => c.code === selectedCountryCode) || countriesList[0]

  // Form State
  const [formData, setFormData] = useState({
    // Shared Name
    firstName: '',
    middleName: '',
    lastName: '',

    // Shared Company Address & Contact
    companyAddress: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Importer specific
    entityName: '',
    businessType: 'تجارة جملة واستيراد',
    taxOrCrNumber: '',

    // Provider specific
    providerName: '',
    serviceType: 'شحن بحري - FCL/LCL',
    fleetDetails: '',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCountryChange = (e) => {
    const code = e.target.value
    setSelectedCountryCode(code)
  }

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('كلمة المرور وتأكيدها غير متطابقين!')
      return
    }

    // Navigate to OTP verification page, passing accountType and contact info
    navigate('/verify-otp', {
      state: {
        accountType,
        email: formData.email,
        phone: formData.phone
      }
    })
  }

  return (
    <div
      className="min-h-screen font-almarai relative flex items-center justify-center p-4 md:p-8 bg-[#011222] overflow-x-hidden select-none py-12"
      dir="rtl"
    >
      {/* Floating Buttons Keyframe Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes meynaPillFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float-pill-1 {
          animation: meynaPillFloat 3.8s ease-in-out infinite 0s;
        }
        .animate-float-pill-2 {
          animation: meynaPillFloat 3.8s ease-in-out infinite 1.2s;
        }
      ` }} />

      {/* Top Floating Action: Home Logo */}
      <Link
        to="/"
        className="animate-float-pill-2 fixed top-5 left-5 sm:top-8 sm:left-8 z-50 flex items-center gap-2.5 bg-[#011222]/85 hover:bg-[#081a2e] px-3.5 sm:px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl group"
        title="الرئيسية"
      >
        <img src="/images/meynaa-logo.png" alt="MEYNAA" className="h-7 w-auto object-contain" />
        <span className="text-white font-bold text-xs hidden sm:inline group-hover:text-[#FB8731] transition-colors">
          الرئيسية
        </span>
      </Link>

      {/* Full-bleed Background Image: Container Ship at Sunset */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/auth-ship-bg.png"
          alt="سفينة شحن في الغروب"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1550px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Right Column (in RTL): Registration Form Card - positioned on the RIGHT */}
        <div className="lg:col-span-7 flex justify-center order-1 lg:order-1">
          <div className="w-full max-w-[700px] bg-white rounded-3xl p-7 md:p-10 shadow-2xl text-right max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full relative">
            {/* Top UserPlus Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FFF4EB] border border-[#FB8731]/30 flex items-center justify-center text-[#FB8731] mx-auto mb-3 shadow-2xs">
              <UserPlus className="w-7 h-7 stroke-[2]" />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-[#011222] tracking-tight">
                إنشاء حساب جديد
              </h1>
              <p className="text-[#64748B] text-xs leading-relaxed mt-1.5 max-w-sm mx-auto font-normal">
                انضم إلى منصة ميناء اللوجستية وأدخل بيانات حسابك لبدء إدارة شحناتك وعروضك
              </p>
            </div>

            {/* 1. Account Type Selector (نوع الحساب) */}
            <div className="mb-6">
              <label className="block text-xs font-black text-[#011222] mb-2 text-right">
                اختر نوع الحساب
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Importer Option */}
                <button
                  type="button"
                  onClick={() => setAccountType('importer')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${
                    accountType === 'importer'
                      ? 'border-[#FB8731] bg-[#FFF8F3] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      accountType === 'importer'
                        ? 'bg-[#FB8731] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Building2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#011222] block">
                      مستورد / صاحب بضاعة
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                      لطلب عروض الأسعار واستيراد الشحنات
                    </span>
                  </div>
                </button>

                {/* Service Provider Option */}
                <button
                  type="button"
                  onClick={() => setAccountType('provider')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${
                    accountType === 'provider'
                      ? 'border-[#011222] bg-gray-50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      accountType === 'provider'
                        ? 'bg-[#011222] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Ship className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#011222] block">
                      مزود خدمة / ناقل
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                      لتقديم العروض وخدمات الشحن والتخليص
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 2. Common Fields: Shared Info for Both Parties */}
              <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <User className="w-4 h-4 text-[#FB8731]" />
                  <span className="text-xs font-black text-[#011222]">
                    البيانات المشتركة (لكلا الطرفين)
                  </span>
                </div>

                {/* أ. الاسم الثلاثي: الاسم الأول، الاسم الثاني، الاسم الأخير */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                    الاسم بالكامل <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* الاسم الأول */}
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="الاسم الأول"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* الاسم الثاني */}
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.middleName}
                        onChange={(e) => handleChange('middleName', e.target.value)}
                        placeholder="الاسم الثاني (اسم الأب)"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* الاسم الأخير */}
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="الاسم الأخير (العائلة)"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* ب. عنوان الشركة */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    عنوان الشركة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.companyAddress}
                      onChange={(e) => handleChange('companyAddress', e.target.value)}
                      placeholder="المدينة، الحي، الشارع، المبنى / المنطقة الصناعية"
                      className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl pr-9 pl-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* ج. اختيار الدولة ورقم الجوال مع مقدمة الدولة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* اختيار الدولة */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      الدولة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl pr-9 pl-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        {countriesList.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name} ({country.dial})
                          </option>
                        ))}
                      </select>
                      <Globe className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* رقم الجوال مع مقدمة الدولة المدمجة */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      رقم الجوال <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5" dir="ltr">
                      {/* مقدمة الدولة المدمجة */}
                      <span className="bg-gray-100 border border-gray-200 rounded-xl px-2.5 py-2.5 text-xs font-bold text-gray-700 font-sans flex items-center gap-1 shrink-0">
                        <span>{currentCountry.flag}</span>
                        <span>{currentCountry.dial}</span>
                      </span>

                      {/* حقل الرقم */}
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="5X XXX XXXX"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] font-sans focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* د. البريد الإلكتروني */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl pr-9 pl-3.5 py-2.5 text-xs text-[#011222] font-sans focus:outline-none transition-colors"
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* هـ. كلمة المرور وتأكيدها */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      كلمة المرور <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl pr-9 pl-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      تأكيد كلمة المرور <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl pr-9 pl-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Dynamic Role-Specific Fields */}
              {accountType === 'importer' ? (
                /* Importer Specific Fields */
                <div className="bg-[#FFF8F3] p-4 rounded-2xl border border-orange-100 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-[#FB8731]" />
                    <span className="text-xs font-black text-[#011222]">
                      بيانات حساب المستورد / صاحب البضاعة
                    </span>
                  </div>

                  {/* هوية النشاط والتوثيق */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        اسم المنشأة أو الشركة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.entityName}
                        onChange={(e) => handleChange('entityName', e.target.value)}
                        placeholder="مثال: مجموعة الريادة للمقاولات"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        نوع النشاط التجاري <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => handleChange('businessType', e.target.value)}
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      >
                        <option value="تجارة جملة واستيراد">تجارة جملة واستيراد</option>
                        <option value="تجارة تجزئة">تجارة تجزئة</option>
                        <option value="تصنيع وإنتاج صناعي">تصنيع وإنتاج صناعي</option>
                        <option value="مقاولات وإنشاءات">مقاولات وإنشاءات</option>
                        <option value="أغذية ومشروبات">أغذية ومشروبات</option>
                        <option value="أجهزة ومعدات إلكترونية">أجهزة ومعدات إلكترونية</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>
                  </div>

                  {/* التوثيق والرقم الضريبي / السجل */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      الرقم الضريبي أو السجل التجاري <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.taxOrCrNumber}
                      onChange={(e) => handleChange('taxOrCrNumber', e.target.value)}
                      placeholder="1010XXXXXX"
                      className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] font-sans focus:outline-none transition-colors"
                      dir="ltr"
                    />
                  </div>
                </div>
              ) : (
                /* Service Provider Specific Fields */
                <div className="bg-gray-50/90 p-4 rounded-2xl border border-gray-200 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="w-4 h-4 text-[#011222]" />
                    <span className="text-xs font-black text-[#011222]">
                      بيانات مزود الخدمة / الناقل
                    </span>
                  </div>

                  {/* هوية المزود والخدمة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        الاسم التجاري لمزود الخدمة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.providerName}
                        onChange={(e) => handleChange('providerName', e.target.value)}
                        placeholder="مثال: شركة الأفق للشحن الدولي"
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        نوع الخدمة الرئيسية <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => handleChange('serviceType', e.target.value)}
                        className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                      >
                        <option value="شحن بحري - FCL/LCL">شحن بحري (حاويات كاملة وجزئية)</option>
                        <option value="شحن جوي سريع">شحن جوي سريع</option>
                        <option value="شحن بري ونقل ثقيل">شحن بري ونقل ثقيل</option>
                        <option value="تخليص جمركي وموانئ">تخليص جمركي وموانئ</option>
                        <option value="تخزين ومستودعات لوجستية">تخزين ومستودعات لوجستية</option>
                        <option value="خدمات لوجستية متكاملة (3PL)">خدمات لوجستية متكاملة (3PL)</option>
                      </select>
                    </div>
                  </div>

                  {/* تفاصيل وسائط النقل */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      عدد وأنواع وسائط النقل المتاحة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fleetDetails}
                      onChange={(e) => handleChange('fleetDetails', e.target.value)}
                      placeholder="مثال: 30 شاحنة نقل ثقيل، 3 مستودعات مبردة، ترخيص ملاحة بحرية"
                      className="w-full bg-white border border-gray-200 focus:border-[#FB8731] rounded-xl px-3.5 py-2.5 text-xs text-[#011222] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* رفع المستندات الثبوتية */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      رفع المستندات الثبوتية (الرخص والأوراق الرسمية) <span className="text-red-500">*</span>
                    </label>
                    <label className="border-2 border-dashed border-gray-300 hover:border-[#FB8731] rounded-xl p-3 flex items-center justify-between cursor-pointer bg-white transition-colors">
                      <div className="flex items-center gap-2.5 text-right">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FB8731] flex items-center justify-center">
                          <UploadCloud className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-700 block">
                            {uploadedFile ? uploadedFile : 'انقر لرفع رخصة النقل أو السجل التجاري'}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            PDF أو صورة حتى 10 ميغابايت
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                      />
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold">
                        {uploadedFile ? 'تم الرفع ✓' : 'اختيار ملف'}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-center justify-start pt-1">
                <div className="flex items-center gap-2 select-none">
                  <div
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer ${
                      agreeTerms ? 'bg-[#FB8731] text-white shadow-xs' : 'border border-gray-300 bg-white'
                    }`}
                  >
                    {agreeTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-[#011222]">
                    أوافق على{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openLegalModal('terms')
                      }}
                      className="font-bold text-[#FB8731] hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                    >
                      الشروط والأحكام
                    </button>{' '}
                    و{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openLegalModal('privacy')
                      }}
                      className="font-bold text-[#FB8731] hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                    >
                      سياسة الخصوصية
                    </button>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-bold text-base shadow-md transition-all mt-3 cursor-pointer ${
                  accountType === 'importer'
                    ? 'bg-[#FB8731] hover:bg-[#E06F1B] text-white shadow-orange-500/20'
                    : 'bg-[#011222] hover:bg-[#0E2841] text-white shadow-blue-900/20'
                }`}
              >
                {accountType === 'importer'
                  ? 'إنشاء حساب مستورد والدخول'
                  : 'إنشاء حساب مزود خدمة والدخول'}
              </button>
            </form>

            {/* Divider: أو */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-[#94A3B8] absolute">أو</span>
            </div>

            {/* Back to Login Link */}
            <div className="text-center text-xs">
              <span className="text-[#64748B]">لديك حساب بالفعل؟ </span>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-[#FB8731] font-bold hover:underline"
              >
                <span>تسجيل الدخول</span>
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Left Column (in RTL) / Brand Card on the LEFT */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center self-center my-auto order-2 lg:order-2 w-full">
          <div className="w-full max-w-[560px] bg-[#011222]/90 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl space-y-6 text-center">
            {/* Brand Slogan */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                بوابتك الى عالم التجارة والشحن الدولي
              </h2>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-normal">
                أنضم الى ميناء واحصل على تجربة شحن اسهل واسرع واكثر اماناً سواء كنت مستورداً أو مزوداً للخدمة
              </p>
            </div>

            {/* 3 Pillars in a Row */}
            <div className="pt-6 flex items-center justify-between max-w-md mx-auto w-full px-2 border-t border-white/10">
              {/* Pillar 1: خدمة متميزة */}
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="w-8 h-8 text-[#FB8731] stroke-[1.8]" />
                <span className="text-xs md:text-sm font-bold text-white">خدمة متميزة</span>
              </div>

              {/* Pillar 2: سرعة في الانجاز */}
              <div className="flex flex-col items-center text-center space-y-2">
                <Zap className="w-8 h-8 text-[#FB8731] stroke-[1.8]" />
                <span className="text-xs md:text-sm font-bold text-white">سرعة في الانجاز</span>
              </div>

              {/* Pillar 3: أمان و موثوقية */}
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#FB8731] stroke-[1.8]" />
                <span className="text-xs md:text-sm font-bold text-white">أمان و موثوقية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
