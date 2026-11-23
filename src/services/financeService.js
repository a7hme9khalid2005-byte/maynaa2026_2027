import api from './api.js'

export const financeService = {
  // 1. فحص سريان الـ 3 أيام المجانية ونسبة العمولة للمستخدم الحالي
  async getTrialStatus() {
    return api.get('/finance/trial-status')
  },

  // 2. جلب بيانات الحساب البنكي لمزود الخدمة الخاص بالشحنة (الآيبان)
  async getProviderBank(shipmentId) {
    return api.get(`/finance/provider-bank/${shipmentId}`)
  },

  // 3. رفع المستورد لإشعار التحويل البنكي الخارجي لتدقيق الأدمن أولاً
  async submitTransferToAdmin(formData) {
    return api.postFormData('/finance/submit-transfer-to-admin', formData)
  },

  // 4. استرجاع الحوالات المعلقة لتدقيق الأدمن العام
  async getAdminPendingTransfers() {
    return api.get('/finance/admin/pending-transfers')
  },

  // 5. اعتماد الأدمن للحوالة وتمريرها لمزود الخدمة
  async approveTransferByAdmin(id, notes = '') {
    return api.post(`/finance/admin/transfers/${id}/approve`, { notes })
  },

  // 6. رفض الأدمن للحوالة مع توضيح السبب
  async rejectTransferByAdmin(id, reason) {
    return api.post(`/finance/admin/transfers/${id}/reject`, { reason })
  },

  // 7. استرجاع الحوالات المعتمدة من الأدمن لمزود الخدمة
  async getProviderPendingTransfers() {
    return api.get('/finance/provider/pending-transfers')
  },

  // 8. تأكيد المزود لاستلام المبلغ في حسابه البنكي الفعلي ⬅️ تفعيل الشحنة
  async confirmTransferByProvider(id) {
    return api.post(`/finance/provider/transfers/${id}/confirm`, {})
  },

  // 9. رفض المزود للحوالة لعدم وصولها
  async rejectTransferByProvider(id, reason) {
    return api.post(`/finance/provider/transfers/${id}/reject`, { reason })
  },

  // 10. جلب الحسابات البنكية للمنصة
  async getPlatformAccounts() {
    return api.get('/finance/platform-accounts')
  },
}

export default financeService
