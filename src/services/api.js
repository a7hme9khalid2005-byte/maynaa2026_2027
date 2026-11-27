// محرك الربط والاتصال بالواجهة الخلفية (Backend API Client)
const BASE_URL = '/api/v1'

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  getToken() {
    return localStorage.getItem('meynaa_token') || ''
  }

  getHeaders(isFormData = false) {
    const headers = {}
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const isFormData = options.body instanceof FormData

    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const error = new Error(data?.message || 'حدث خطأ أثناء الاتصال بالخادم')
        error.status = response.status
        error.data = data
        throw error
      }

      return data
    } catch (err) {
      console.warn(`[API Error] ${endpoint}:`, err.message)
      throw err
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers })
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    })
  }

  postFormData(endpoint, formData, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    })
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    })
  }

  patch(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    })
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers })
  }
}

export const api = new ApiClient(BASE_URL)
export default api
