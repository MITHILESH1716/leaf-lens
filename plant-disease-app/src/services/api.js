import diseases from '../data/diseases'
// API configuration
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

  // FormData sets its own Content-Type
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

/* ---------- existing: fake prediction ---------- */

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

/* ---------- authentication ---------- */

export const loginUser = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const registerUser = (name, email, password) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

/* ---------- website data ---------- */

export const getAgriculture = (category = '') =>
  request(`/agriculture${category ? `?category=${category}` : ''}`)

export const getProducts = () => request('/products')

/* ---------- scans ---------- */

export const saveScan = (scan) =>
  request('/scans', {
    method: 'POST',
    body: JSON.stringify(scan),
  })

/* ---------- admin ---------- */

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

/* ---------- orders and demo payments ---------- */

// Create a new pending order
export const createOrder = (orderData) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })

// Fetch payment details using the QR payment token
export const getDemoPayment = (token) =>
  request(`/orders/demo-payment/${token}`)

// Simulate payment
export const payDemoPayment = (token) =>
  request(`/orders/demo-payment/${token}/pay`, {
    method: 'POST',
  })

// Check whether payment is completed
export const getOrderStatus = (orderId) =>
  request(`/orders/${orderId}/status`)
