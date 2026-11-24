import diseases from '../data/diseases'

const API = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  try {
    return JSON.parse(sessionStorage.getItem('leafcareUser'))?.token || ''
  } catch {
    return ''
  }
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  const token = getToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// Prediction
export async function predictDisease() {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const labels = Object.keys(diseases)
  const label = labels[Math.floor(Math.random() * labels.length)]
  const confidence = 85 + Math.random() * 14

  return {
    label,
    confidence: confidence.toFixed(1),
  }
}

// Authentication
export const loginUser = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const registerUser = (userData) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })

// Website data
export const getAgriculture = (category = '') =>
  request(`/agriculture${category ? `?category=${category}` : ''}`)

export const getProducts = () => request('/products')

// Scans
export const saveScan = (scan) =>
  request('/scans', {
    method: 'POST',
    body: JSON.stringify(scan),
  })

// Admin
export const getAdminStats = () => request('/admin/stats')

export const createAgriculture = (formData) =>
  request('/agriculture', {
    method: 'POST',
    body: formData,
  })

export const updateAgriculture = (id, formData) =>
  request(`/agriculture/${id}`, {
    method: 'PUT',
    body: formData,
  })

export const deleteAgriculture = (id) =>
  request(`/agriculture/${id}`, {
    method: 'DELETE',
  })

export const createProduct = (formData) =>
  request('/products', {
    method: 'POST',
    body: formData,
  })

export const updateProduct = (id, formData) =>
  request(`/products/${id}`, {
    method: 'PUT',
    body: formData,
  })

export const deleteProduct = (id) =>
  request(`/products/${id}`, {
    method: 'DELETE',
  })

// Orders and demo payments
export const createOrder = (orderData) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })

export const getDemoPayment = (token) =>
  request(`/orders/demo-payment/${token}`)

export const payDemoPayment = (token) =>
  request(`/orders/demo-payment/${token}/pay`, {
    method: 'POST',
  })

export const getOrderStatus = (orderId) =>
  request(`/orders/${orderId}/status`)

// User profile
export const getProfile = () => request('/profile')

export const updateProfile = (profileData) =>
  request('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  })

export const uploadProfilePicture = (file) => {
  const formData = new FormData()
  formData.append('picture', file)

  return request('/profile/picture', {
    method: 'POST',
    body: formData,
  })
}

export const getMyOrders = () => request('/profile/orders')