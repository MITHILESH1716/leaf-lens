import { useState, useEffect, useCallback } from 'react'
import {
getProducts,
createProduct,
updateProduct,
deleteProduct,
} from '../../services/api'
// must match PRODUCT_CATEGORIES in server/models/Product.js
const categories = ['Fungicide', 'Organic Pesticide', 'Fertilizer', 'Soil & Compost']
const emptyForm = {
name: '',
category: categories[0],
price: '',
unit: '',
description: '',
usedFor: '',
}
function ProductManager({ onChange }) {
const [products, setProducts] = useState([])
const [form, setForm] = useState(emptyForm)
const [file, setFile] = useState(null)
const [fileKey, setFileKey] = useState(0)
const [editingId, setEditingId] = useState(null)
const [saving, setSaving] = useState(false)
const [message, setMessage] = useState('')
const [error, setError] = useState('')
const loadProducts = useCallback(() => {
getProducts()
.then(setProducts)
.catch((err) => setError(err.message))
}, [])
useEffect(() => {
loadProducts()
}, [loadProducts])
function handleChange(e) {
setForm({ ...form, [e.target.name]: e.target.value })
}
function resetForm() {
setForm(emptyForm)
setFile(null)
setFileKey((k) => k + 1)
setEditingId(null)
}
async function handleSubmit(e) {
e.preventDefault()
setError('')
setMessage('')
setSaving(true)
const data = new FormData()
Object.entries(form).forEach(([key, value]) => data.append(key, value))
if (file) data.append('image', file)
try {
if (editingId) await updateProduct(editingId, data)
else await createProduct(data)
setMessage(editingId ? 'Product updated' : 'Product added')
resetForm()
loadProducts()
onChange?.()
} catch (err) {
setError(err.message)
} finally {
setSaving(false)
}
}
function startEdit(p) {
setEditingId(p.id)
setForm({
name: p.name,
category: p.category,
price: String(p.price),
unit: p.unit || '',
description: p.description || '',
usedFor: p.usedFor || '',
})
setFile(null)
setFileKey((k) => k + 1)
setMessage('')
window.scrollTo({ top: 0, behavior: 'smooth' })
}
async function handleDelete(p) {
if (!window.confirm(`Delete "${p.name}"?`)) return
try {
await deleteProduct(p.id)
loadProducts()
onChange?.()
} catch (err) {
setError(err.message)
}
}
return (
<div>
<form className="card admin-form" onSubmit={handleSubmit}>
<h3>{editingId ? 'Edit product' : 'Add product'}</h3>
<div className="field">
<label>Product name</label>
<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="e.g. Neem Oil Concentrate"
required
/>
</div>
<div className="row2">
<div className="field">
<label>Type</label>
<select name="category" value={form.category} onChange={handleChange}>
{categories.map((c) => <option key={c} value={c}>{c}</option>)}
</select>
</div>
<div className="field">
<label>Price (INR)</label>
<input
name="price"
type="number"
min="0"
step="any"
value={form.price}
onChange={handleChange}
placeholder="199"
required
/>
</div>
</div>
<div className="field">
<label>Pack size / unit</label>
<input
name="unit"
value={form.unit}
onChange={handleChange}
placeholder="e.g. 500 ml, 1 kg"
/>
</div>
<div className="field">
<label>Description</label>
<textarea name="description" rows="3" value={form.description} onChange={handleChange} />
</div>
<div className="field">
<label>Good for</label>
<input
name="usedFor"
value={form.usedFor}
onChange={handleChange}
placeholder="e.g. Aphids, whitefly, mild rust"
/>
</div>
<div className="field">
<label>Image {editingId && '(leave empty to keep the current image)'}</label>
<input
key={fileKey}
type="file"
accept="image/*"
onChange={(e) => setFile(e.target.files[0] || null)}
/>
{file && <img className="preview" src={URL.createObjectURL(file)} alt="Selected" />}
</div>
{error && <p className="error">{error}</p>}
{message && <p className="success">{message}</p>}
<div className="btn-row">
<button className="btn" type="submit" disabled={saving}>
{saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
</button>
{editingId && (
<button type="button" className="btn btn-outline" onClick={resetForm}>
Cancel
</button>
)}
</div>
</form>
<div className="admin-list">
{products.length === 0 && <p className="muted">No products yet.</p>}
{products.map((p) => (
<div className="admin-row" key={p.id}>
{p.image ? (
<img className="thumb" src={p.image} alt={p.name} />
) : (
<div className="thumb" />
)}
<div className="grow">
<strong>{p.name}</strong>
<div>
<span className="badge">{p.category}</span>{' '}
<span className="muted">INR {p.price} / {p.unit}</span>
</div>
</div>
<div className="actions">
<button className="btn btn-small btn-outline" onClick={() => startEdit(p)}>
Edit
</button>
<button className="link-btn" onClick={() => handleDelete(p)}>
Delete
</button>
</div>
</div>
))}
</div>
</div>
)
}
export default ProductManager