import { useState } from 'react'
import AdminSidebar from '../../../components/dashboard/AdminSidebar'
import AdminHeader from '../../../components/dashboard/AdminHeader'
import {
  Percent,
  FileText,
  Ship,
  Truck,
  Plane,
  FileCheck2,
  Download,
  Shield,
  HelpCircle,
  Bold,
  Italic,
  Underline,
  List,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  Link2,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Webhook,
  CheckCircle,
  Eye,
  X,
  Sliders,
  Plus
} from 'lucide-react'

// Policy default texts matching screenshot exactly
const policyDocuments = {
  terms: `مرحباً بك في منصة Meynaa.
باستخدامك للمنصة فإنك توافق على الشروط والأحكام الموضحة أدناه، والتي تنظم العلاقة بينك وبين المنصة وتضمن حقوق المستوردين ومزودي الخدمات اللوجستية وفق الأنظمة المعتمدة.`,
  privacy: `سياسة الخصوصية
ماذا نجمع؟
البيانات الأساسية :الاسم ،الهاتف ،البريد الإلكتروني ، بيانات الموقع: GPS لمتابعة حركة الشحن ، بيانات الجهاز: مدخل الجهاز، IP

لماذا نستخدمها؟
لتقديم الخدمات، لتسليم الصحيح، لتواصل معك، لتحسين المنصة

مع من نشاركها؟
الموظفون المعنيون، شركاء التوصيل، الجهات القانونية`,
  faqs: `أسئلة المساعدة الشائعة - منصة Meynaa:
1. كيفية تتبع الشحنة؟ عبر إدخال رقم التتبع في قسم إدارة الشحنات.
2. ما هي طرق الدفع؟ البطاقات الائتمانية، التحويل البنكي، والمحافظ الإلكترونية.
3. التخليص الجمركي؟ يتم رفع المستندات المطلوبة عبر بوابة المستندات الرقمية.`
}

// Initial FAQs matching media_1794246657414_784d221b.png
const initialFaqs = [
  {
    id: 1,
    question: 'كيفية تتبع شحنتي ؟',
    answer:
      'يمكنك تتبع شحنتك بسهولة من خلال الدخول إلى حسابك في المنصة ، ثم الانتقال إلى قسم «تتبع الشحنات» وإدخال رقم التتبع الخاص بشحنتك ، ستظهر لك آخر التحديثات المتعلقة بموقع الشحنة ، وحالتها ومراحل وصولها حتى التسليم.',
    date: '2026/8/14 - 6:12 PM'
  },
  {
    id: 2,
    question: 'ما هي رسوم الشحن ؟',
    answer:
      'تختلف رسوم الشحن حسب عدة عوامل، منها وزن الشحنة وأبعادها، ومكان الاستلام والتسليم، ونوع خدمة الشحن المطلوبة، يمكنك معرفة التكلفة التقديرية قبل تأكيد طلب الشحن من خلال المنصة، وقد تُضاف رسوم جمركية أو رسوم أخرى حسب الوجهة.',
    date: '2026/8/14 - 4:20 PM'
  },
  {
    id: 3,
    question: 'كيف أتعامل مع تأخير الشحنة ؟',
    answer:
      'إذا تأخرت شحنتك عن موعد التسليم المتوقع، يمكنك أولاً التحقق من حالة الشحنة عبر خدمة التتبع. إذا لم تظهر تحديثات جديدة أو استمر التأخير، يرجى التواصل مع فريق الدعم الفني وتزويدهم برقم الشحنة لمساعدتك في معرفة سبب التأخير ومتابعة المشكلة.',
    date: '2026/8/14 - 4:10 PM'
  },
  {
    id: 4,
    question: 'ما هي المستندات المطلوبة للتخليص الجمركي؟',
    answer:
      ':تختلف المستندات المطلوبة حسب نوع البضائع وبلد الاستيراد والتصدير، ولكنها غالباً تشمل\nالفاتورة التجارية\n(Packing List) قائمة التعبئة\nبوليصة الشحن\nشهادة المنشأ عند الحاجة\nالتصاريح أو الشهادات الخاصة لبعض أنواع البضائع',
    date: '2026/8/14 - 3:00 PM'
  },
  {
    id: 5,
    question: 'كيفية التواصل المباشر مع فريق الدعم الفني؟',
    answer:
      'يمكنك التواصل مع فريق الدعم الفني من خلال قسم «اتصل بنا» في المنصة، أو عبر قنوات التواصل المتاحة مثل المحادثة المباشرة والبريد الإلكتروني، يرجى توضيح المشكلة وإرفاق رقم الشحنة إن وجد، حتى يتمكن فريق الدعم من مساعدتك بشكل أسرع.',
    date: '2026/8/14 - 2:30 PM'
  },
  {
    id: 6,
    question: 'ماهي طرق الدفع المعتمدة في منصة ميناء؟',
    answer:
      'توفر المنصة طرق دفع متعددة بحسب الخيارات المتاحة، وقد تشمل:\nالبطاقات البنكية (Visa وMastercard)\nالتحويل البنكي\nالمحافظ الإلكترونية، إذا كانت مدعومة',
    date: '2026/8/14 - 1:30 PM'
  }
]

export default function AdminSettingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Active View: 'general' (Commission + Terms + Gateways), 'privacy' (Privacy Policy), or 'faqs' (FAQs matching screenshot)
  const [activeView, setActiveView] = useState('general')

  // FAQs State
  const [faqs, setFaqs] = useState(initialFaqs)
  const [showAddFaqModal, setShowAddFaqModal] = useState(false)
  const [newFaqQuestion, setNewFaqQuestion] = useState('')
  const [newFaqAnswer, setNewFaqAnswer] = useState('')

  // Sector Commissions State
  const [commissions, setCommissions] = useState({
    sea: '2.50',
    land: '1.50',
    customs: '1.00',
    air: '3.00'
  })

  // Selected Policy Tab: 'terms', 'privacy', 'faqs'
  const [selectedPolicyTab, setSelectedPolicyTab] = useState('terms')
  const [policyTexts, setPolicyTexts] = useState(policyDocuments)

  // Gateways & Messaging State
  const [gateways, setGateways] = useState({
    emailEnabled: true,
    emailAddress: 'noreply@meynaa.com',
    smsEnabled: true,
    smsSender: 'شركة الاتصالات الفلسطينية',
    webhookEnabled: true,
    webhookUrl: 'https://api.meynaa.com/webhook'
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  // Handle Commissions Save
  const handleSaveCommissions = (e) => {
    e.preventDefault()
    showToast('تم حفظ نسب عمولات المنصة لجميع القطاعات بنجاح')
  }

  // Handle Policy Document Save
  const handleSavePolicy = () => {
    const titles = {
      terms: 'شروط الاستخدام',
      privacy: 'سياسة الخصوصية',
      faqs: 'أسئلة المساعدة الشائعة'
    }
    showToast(`تم حفظ وتحديث نصوص «${titles[selectedPolicyTab]}» بنجاح`)
  }

  // Handle Gateway Toggle
  const handleToggleGateway = (key) => {
    setGateways((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      showToast('تم تحديث حالة البوابة بنجاح')
      return updated
    })
  }

  // Add new FAQ
  const handleAddFaq = (e) => {
    e.preventDefault()
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return

    const newEntry = {
      id: Date.now(),
      question: newFaqQuestion,
      answer: newFaqAnswer,
      date: '2026/8/14 - 7:00 PM'
    }

    setFaqs([newEntry, ...faqs])
    setShowAddFaqModal(false)
    setNewFaqQuestion('')
    setNewFaqAnswer('')
    showToast('تمت إضافة السؤال الجديد إلى قائمة أسئلة المساعدة الشائعة بنجاح')
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

      {/* Add FAQ Modal */}
      {showAddFaqModal && (
        <div className="fixed inset-0 bg-[#011222]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 lg:p-8 shadow-2xl border border-gray-100 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FB8731] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#011222] text-base">إضافة سؤال جديد للمساعدة</h3>
                  <p className="text-[11px] text-gray-400 font-medium">سيظهر السؤال لجميع مستخدمي المنصة</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFaqModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">نص السؤال:</label>
                <input
                  type="text"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="مثال: كيفية تتبع الشحنة الدولية؟"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-[#011222] focus:outline-none focus:border-[#FB8731]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">الإجابة التفصيلية:</label>
                <textarea
                  rows="4"
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="اكتب الإجابة الشاملة هنا..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-[#011222] focus:outline-none focus:border-[#FB8731] resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#011222] hover:bg-[#02203d] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#011222]/20"
                >
                  <Plus className="w-4 h-4 text-[#FB8731]" />
                  <span>إضافة السؤال</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFaqModal(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Privacy Policy Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-[#011222]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 lg:p-8 shadow-2xl border border-gray-100 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0284C7] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#011222] text-base">معاينة سياسة الخصوصية المعتمدة</h3>
                  <p className="text-[11px] text-gray-400 font-medium">النسخة المعروضة للجمهور والمستخدمين</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-4 text-xs leading-relaxed text-gray-700 whitespace-pre-line font-medium max-h-[60vh] overflow-y-auto">
              {policyTexts.privacy}
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-6 bg-[#011222] hover:bg-[#02203d] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar activePath="/admin/settings" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[280px] flex flex-col min-h-screen select-none overflow-x-hidden">
        {/* Top Header Bar pinned edge-to-edge matching screenshot */}
        <AdminHeader searchValue={searchQuery} onSearch={setSearchQuery} />

        {/* Inner Content Area */}
        <div className="p-6 lg:p-8 space-y-6">
          {/* Quick Sub-Navigation Pills to toggle between General Settings, Privacy Policy, and FAQs */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-right">
              <h1 className="text-2xl font-black text-[#011222] tracking-tight">
                {activeView === 'privacy'
                  ? 'سياسة الخصوصية'
                  : activeView === 'faqs'
                  ? 'أسئلة المساعدة الشائعة'
                  : 'إعدادات المنصة و سياسات التشغيل'}
              </h1>
              {activeView === 'privacy' && (
                <p className="text-xs text-gray-500 font-medium mt-1">
                  قم بمراجعة و تحديث سياسة الخصوصية الخاصة بالمنصة
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setActiveView('general')
                  setSelectedPolicyTab('terms')
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeView === 'general'
                    ? 'bg-[#011222] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#FB8731]" />
                <span>إعدادات المنصة العامة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('privacy')
                  setSelectedPolicyTab('privacy')
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeView === 'privacy'
                    ? 'bg-[#0084D1] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>سياسة الخصوصية</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('faqs')
                  setSelectedPolicyTab('faqs')
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeView === 'faqs'
                    ? 'bg-[#0084D1] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>أسئلة المساعدة الشائعة</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* VIEW C: FAQs TABLE VIEW matching media_1794246657414_784d221b.png */}
          {/* ========================================================= */}
          {activeView === 'faqs' && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Row matching screenshot: Title on right + Add Question button on left */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddFaqModal(true)}
                  className="bg-[#011222] hover:bg-[#02203d] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#011222]/15 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>إضافة سؤال جديد</span>
                </button>

                <h2 className="text-xl font-black text-[#011222]">أسئلة المساعدة الشائعة</h2>
              </div>

              {/* FAQs Table Container matching screenshot */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-[#F0F6FB] text-gray-700 font-bold border-b border-gray-200/80">
                        <th className="py-4 px-6 text-center text-gray-700 font-bold w-48">التاريخ</th>
                        <th className="py-4 px-6 text-center text-gray-700 font-bold">الإجابات</th>
                        <th className="py-4 px-6 text-right text-gray-700 font-bold w-64">الأسئلة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {faqs.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                          {/* Date (Left in RTL) */}
                          <td className="py-5 px-6 text-gray-500 font-medium dir-ltr text-center align-middle text-xs font-mono">
                            {item.date}
                          </td>

                          {/* Answer (Middle) */}
                          <td className="py-5 px-6 text-gray-600 leading-relaxed font-medium align-middle text-right text-xs whitespace-pre-line">
                            {item.answer}
                          </td>

                          {/* Question (Right in RTL) */}
                          <td className="py-5 px-6 font-bold text-[#011222] text-xs align-middle text-right">
                            {item.question}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW A: DEDICATED PRIVACY POLICY VIEW matching media_1794246580177_c337e8cd.png */}
          {/* ========================================================= */}
          {activeView === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              {/* Status & Preview Card matching screenshot top */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Right (in RTL): Preview Button */}
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="px-6 py-2.5 border-2 border-[#0084D1] text-[#0084D1] hover:bg-sky-50 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <Eye className="w-4 h-4 text-[#0084D1]" />
                  <span>معاينة الصفحة</span>
                </button>

                {/* Left (in RTL): Active Badge & Last update text */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium font-mono dir-ltr">
                    آخر تحديث: 2026/ 11/8 - 2:25 PM
                  </span>
                  <span className="px-4 py-1 rounded-full text-xs font-bold bg-[#E6F9F0] text-[#009F65] border border-emerald-200/80">
                    مفعلة
                  </span>
                </div>
              </div>

              {/* Dark Banner: محتوى سياسة الخصوصية */}
              <div className="flex justify-start">
                <div className="bg-[#011222] text-white px-8 py-2 rounded-2xl text-xs font-black shadow-md shadow-[#011222]/15">
                  محتوى سياسة الخصوصية
                </div>
              </div>

              {/* Container with Toolbar & Rich Editor matching screenshot */}
              <div className="bg-[#F0F6FB] rounded-3xl p-6 border border-sky-100/70 shadow-sm">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  {/* Rich Text Toolbar */}
                  <div className="flex flex-wrap items-center justify-start gap-1 pb-3 mb-4 border-b border-gray-100 text-gray-600">
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="عريض (Bold)"
                    >
                      <Bold className="w-4 h-4 font-black" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="مائل (Italic)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="تسطير (Underline)"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <span className="w-px h-4 bg-gray-200 mx-1"></span>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="قائمة نقطية"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="محاذاة لليمين"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="محاذاة للوسط"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="محاذاة لليسار"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="محاذاة متساوية"
                    >
                      <AlignJustify className="w-4 h-4" />
                    </button>
                    <span className="w-px h-4 bg-gray-200 mx-1"></span>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="إدراج رابط"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                      title="إدراج صورة"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Textarea matching screenshot content */}
                  <textarea
                    rows="11"
                    value={policyTexts.privacy}
                    onChange={(e) =>
                      setPolicyTexts({
                        ...policyTexts,
                        privacy: e.target.value
                      })
                    }
                    className="w-full bg-gray-50/40 border border-gray-200/80 rounded-xl p-5 text-sm text-[#011222] leading-relaxed font-medium focus:outline-none focus:border-[#0084D1] resize-none mb-4 text-right"
                  ></textarea>

                  {/* Save button matching screenshot */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        showToast('تم حفظ وتحديث سياسة الخصوصية بنجاح')
                      }}
                      className="bg-[#011222] hover:bg-[#02203d] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#011222]/15 cursor-pointer active:scale-95"
                    >
                      <span>حفظ التغييرات</span>
                      <Download className="w-3.5 h-3.5 text-[#FB8731]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW B: GENERAL PLATFORM SETTINGS matching previous screenshot */}
          {/* ========================================================= */}
          {activeView === 'general' && (
            <div className="space-y-6 animate-fade-in">
              {/* SECTION 1: ضبط عمولة المنصة لكل قطاع */}
              <div className="bg-[#F0F6FB] rounded-3xl p-6 border border-sky-100/70 shadow-sm">
                {/* Header Dark Pill & Subtitle */}
                <div className="flex flex-col items-start mb-6 text-right">
                  <div className="bg-[#011222] text-white px-7 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md shadow-[#011222]/15">
                    <span>ضبط عمولة المنصة لكل قطاع</span>
                    <div className="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center text-[10px]">
                      <Percent className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-2">
                    يمكنك تحديد عمولة المنصة لكل قطاع من القطاعات التالية
                  </p>
                </div>

                {/* Form row: Save button on left + 4 cards on right */}
                <form onSubmit={handleSaveCommissions} className="flex flex-col lg:flex-row items-center gap-4">
                  {/* Save Button on the far left */}
                  <button
                    type="submit"
                    className="w-full lg:w-auto bg-[#011222] hover:bg-[#02203d] text-white px-7 py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#011222]/15 cursor-pointer active:scale-95"
                  >
                    <span>حفظ التغييرات</span>
                    <Download className="w-4 h-4 text-[#FB8731]" />
                  </button>

                  {/* 4 Sector Cards with Harmonized Translucent Tinted Backgrounds */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
                    {/* 1. Sea Freight (Translucent Sky Blue Tint) */}
                    <div className="bg-[#F0F9FF]/80 backdrop-blur-xs rounded-2xl p-4 border border-[#BAE6FD]/70 hover:border-[#0284C7]/50 shadow-[0_2px_12px_rgba(2,132,199,0.04)] hover:shadow-md transition-all flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#BAE6FD] flex items-center justify-center text-[#0284C7] mb-2 shadow-xs">
                        <Ship className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-black text-[#0369A1] mb-2">شحن بحري</h4>
                      <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-[#BAE6FD] w-32 justify-center shadow-xs">
                        <span className="text-xs font-bold text-gray-400">%</span>
                        <input
                          type="text"
                          value={commissions.sea}
                          onChange={(e) => setCommissions({ ...commissions, sea: e.target.value })}
                          className="w-14 bg-transparent text-center text-xs font-black text-[#011222] font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 2. Land Freight (Translucent Meynaa Orange Tint) */}
                    <div className="bg-[#FFF7ED]/80 backdrop-blur-xs rounded-2xl p-4 border border-[#FED7AA]/70 hover:border-[#FB8731]/50 shadow-[0_2px_12px_rgba(251,135,49,0.04)] hover:shadow-md transition-all flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#FED7AA] flex items-center justify-center text-[#FB8731] mb-2 shadow-xs">
                        <Truck className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-black text-[#C2410C] mb-2">شحن بري</h4>
                      <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-[#FED7AA] w-32 justify-center shadow-xs">
                        <span className="text-xs font-bold text-gray-400">%</span>
                        <input
                          type="text"
                          value={commissions.land}
                          onChange={(e) => setCommissions({ ...commissions, land: e.target.value })}
                          className="w-14 bg-transparent text-center text-xs font-black text-[#011222] font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 3. Customs Clearance (Translucent Emerald Green Tint) */}
                    <div className="bg-[#ECFDF5]/80 backdrop-blur-xs rounded-2xl p-4 border border-[#A7F3D0]/70 hover:border-[#009F65]/50 shadow-[0_2px_12px_rgba(0,159,101,0.04)] hover:shadow-md transition-all flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#A7F3D0] flex items-center justify-center text-[#009F65] mb-2 shadow-xs">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-black text-[#047857] mb-2">تخليص جمركي</h4>
                      <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-[#A7F3D0] w-32 justify-center shadow-xs">
                        <span className="text-xs font-bold text-gray-400">%</span>
                        <input
                          type="text"
                          value={commissions.customs}
                          onChange={(e) => setCommissions({ ...commissions, customs: e.target.value })}
                          className="w-14 bg-transparent text-center text-xs font-black text-[#011222] font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 4. Air Freight (Translucent Purple Tint) */}
                    <div className="bg-[#F5F3FF]/80 backdrop-blur-xs rounded-2xl p-4 border border-[#DDD6FE]/70 hover:border-[#7C3AED]/50 shadow-[0_2px_12px_rgba(124,58,237,0.04)] hover:shadow-md transition-all flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED] mb-2 shadow-xs">
                        <Plane className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-black text-[#6D28D9] mb-2">شحن جوي</h4>
                      <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-[#DDD6FE] w-32 justify-center shadow-xs">
                        <span className="text-xs font-bold text-gray-400">%</span>
                        <input
                          type="text"
                          value={commissions.air}
                          onChange={(e) => setCommissions({ ...commissions, air: e.target.value })}
                          className="w-14 bg-transparent text-center text-xs font-black text-[#011222] font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* SECTION 2: إدارة نصوص و سياسات شروط الاستخدام */}
              <div className="bg-[#F0F6FB] rounded-3xl p-6 border border-sky-100/70 shadow-sm">
                {/* Header Dark Pill & Subtitle */}
                <div className="flex flex-col items-start mb-6 text-right">
                  <div className="bg-[#011222] text-white px-7 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md shadow-[#011222]/15">
                    <span>إدارة نصوص و سياسات شروط الاستخدام</span>
                    <FileText className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-2">
                    يمكنك إدارة محتوى صفحات الشروط و السياسات و المساعدة
                  </p>
                </div>

                {/* Rich Text Editor Card (Full Width) */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      {/* Rich Text Toolbar */}
                      <div className="flex flex-wrap items-center justify-start gap-1 pb-3 mb-3 border-b border-gray-100 text-gray-600">
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="عريض (Bold)"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="مائل (Italic)"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="تسطير (Underline)"
                        >
                          <Underline className="w-4 h-4" />
                        </button>
                        <span className="w-px h-4 bg-gray-200 mx-1"></span>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="قائمة نقطية"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="محاذاة لليمين"
                        >
                          <AlignRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="محاذاة للوسط"
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="محاذاة لليسار"
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="محاذاة متساوية"
                        >
                          <AlignJustify className="w-4 h-4" />
                        </button>
                        <span className="w-px h-4 bg-gray-200 mx-1"></span>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="إدراج رابط"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#011222] transition-colors cursor-pointer"
                          title="إدراج صورة"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Formatted Textarea */}
                      <textarea
                        rows="6"
                        value={policyTexts[selectedPolicyTab]}
                        onChange={(e) =>
                          setPolicyTexts({
                            ...policyTexts,
                            [selectedPolicyTab]: e.target.value
                          })
                        }
                        className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl p-4 text-xs text-[#011222] leading-relaxed focus:outline-none focus:border-[#FB8731] resize-none mb-4 text-right"
                      ></textarea>
                    </div>

                    {/* Save Changes button on bottom left */}
                    <div className="flex justify-start">
                      <button
                        type="button"
                        onClick={handleSavePolicy}
                        className="bg-[#011222] hover:bg-[#02203d] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#011222]/15 cursor-pointer active:scale-95"
                      >
                        <span>حفظ التغييرات</span>
                        <Download className="w-3.5 h-3.5 text-[#FB8731]" />
                      </button>
                    </div>
                </div>
              </div>

              {/* SECTION 3: إعدادات بوابات الرسائل والـ SMS و Webhooks */}
              <div className="bg-[#F0F6FB] rounded-3xl p-6 border border-sky-100/70 shadow-sm">
                {/* Header Dark Pill */}
                <div className="flex justify-start mb-6">
                  <div className="bg-[#011222] text-white px-7 py-2 rounded-2xl text-xs font-black shadow-md shadow-[#011222]/15">
                    إعدادات بوابات الرسائل و الـ SMS و Webhookes
                  </div>
                </div>

                {/* 3 Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* 1. Emails */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleToggleGateway('emailEnabled')}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                            gateways.emailEnabled ? 'bg-[#0284C7]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                              gateways.emailEnabled ? '-translate-x-6' : '-translate-x-1'
                            }`}
                          ></span>
                        </button>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-black text-[#011222]">بوابة الرسائل (Emails)</h3>
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0284C7]">
                            <Mail className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-4 text-right">
                        إرسال إشعارات عبر البريد الإلكتروني
                      </p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1.5 text-right">
                        البريد الإلكتروني المعتمد
                      </label>
                      <input
                        type="email"
                        value={gateways.emailAddress}
                        onChange={(e) => setGateways({ ...gateways, emailAddress: e.target.value })}
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 text-center font-mono focus:outline-none focus:border-[#FB8731]"
                      />
                    </div>
                  </div>

                  {/* 2. SMS */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleToggleGateway('smsEnabled')}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                            gateways.smsEnabled ? 'bg-[#0284C7]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                              gateways.smsEnabled ? '-translate-x-6' : '-translate-x-1'
                            }`}
                          ></span>
                        </button>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-black text-[#011222]">خدمة الرسائل النصية (SMS)</h3>
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0284C7]">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-4 text-right">
                        إرسال إشعارات عبر الرسائل النصية
                      </p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1.5 text-right">
                        المرسل
                      </label>
                      <input
                        type="text"
                        value={gateways.smsSender}
                        onChange={(e) => setGateways({ ...gateways, smsSender: e.target.value })}
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 text-center focus:outline-none focus:border-[#FB8731]"
                      />
                    </div>
                  </div>

                  {/* 3. Webhooks */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleToggleGateway('webhookEnabled')}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                            gateways.webhookEnabled ? 'bg-[#0284C7]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                              gateways.webhookEnabled ? '-translate-x-6' : '-translate-x-1'
                            }`}
                          ></span>
                        </button>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-black text-[#011222]">Webhooks</h3>
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0284C7]">
                            <Webhook className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-4 text-right">
                        إعداد Webhooks لاستقبال الإشعارات من الأنظمة الخارجية
                      </p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1.5 text-right">
                        رابط Webhooks
                      </label>
                      <input
                        type="text"
                        value={gateways.webhookUrl}
                        onChange={(e) => setGateways({ ...gateways, webhookUrl: e.target.value })}
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 text-center font-mono focus:outline-none focus:border-[#FB8731]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
