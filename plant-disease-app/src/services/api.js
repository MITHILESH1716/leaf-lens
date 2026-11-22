import diseases from '../data/diseases'
// In development Vite forwards /api to localhost:5000 (see vite.config.js).
// For a deployed site set VITE_API_URL, e.g. https://leafcare-api.onrender.com/api
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
if (token) headers.Authorization = `Bearer ${token}`
// FormData (image uploads) sets its own Content-Type, so only set it for JSON
if (options.body && !(options.body instanceof FormData)) {
headers['Content-Type'] = 'application/json'
}
const res = await fetch(`${API}${path}`, { ...options, headers })
const data = await res.json().catch(() => ({}))
if (!res.ok) throw new Error(data.message || 'Something went wrong')
return data
}
/* ---------- existing: fake prediction (unchanged) ---------- */
export async function predictDisease() {
// pretend the model is thinking
await new Promise((resolve) => setTimeout(resolve, 1500))
// pick a random disease for testing
const labels = Object.keys(diseases)
const label = labels[Math.floor(Math.random() * labels.length)]
const confidence = 85 + Math.random() * 14
return { label, confidence: confidence.toFixed(1) }
}
/* ---------- auth ---------- */
export const loginUser = (email, password) =>
request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
export const registerUser = (name, email, password) =>
request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
/* ---------- website data (public) ---------- */
export const getAgriculture = (category = '') =>
request(`/agriculture${category ? `?category=${category}` : ''}`)
export const getProducts = () => request('/products')
/* ---------- scans ---------- */
export const saveScan = (scan) =>
request('/scans', { method: 'POST', body: JSON.stringify(scan) })
/* ---------- admin ---------- */
export const getAdminStats = () => request('/admin/stats')
// formData contains the text fields and the optional "image" file
export const createAgriculture = (formData) =>
request('/agriculture', { method: 'POST', body: formData })
export const updateAgriculture = (id, formData) =>
request(`/agriculture/${id}`, { method: 'PUT', body: formData })
export const deleteAgriculture = (id) =>
request(`/agriculture/${id}`, { method: 'DELETE' })
export const createProduct = (formData) =>
request('/products', { method: 'POST', body: formData })
export const updateProduct = (id, formData) =>
request(`/products/${id}`, { method: 'PUT', body: formData })
export const deleteProduct = (id) =>
request(`/products/${id}`, { method: 'DELETE' })