import api from './api.js'

export const shipmentService = {
  // جلب كافة شحنات المستخدم
  async getMyShipments(params = {}) {
    const query = new URLSearchParams(params).toString()
    return api.get(`/shipments${query ? `?${query}` : ''}`)
  },

  // تفاصيل شحنة واحدة
  async getShipmentDetails(id) {
    return api.get(`/shipments/${id}`)
  },

  // إنشاء شحنة جديدة
  async createShipment(data) {
    return api.post('/shipments', data)
  },

  // تحديث حالة الشحنة
  async updateStatus(id, status) {
    return api.patch(`/shipments/${id}/status`, { status })
  },
}

export default shipmentService
