import { useState, useEffect, useCallback } from 'react'
import {
getAgriculture,
createAgriculture,
updateAgriculture,
deleteAgriculture,
} from '../../services/api'
const categories = [
{ value: 'soil', label: 'Soil' },
{ value: 'crop', label: 'Crop' },
{ value: 'climate', label: 'Climate' },
{ value: 'region', label: 'Region' },
]
const emptyForm = { category: 'soil', name: '', content: '' }
const contentHint = 'Found in: Deccan plateau\n- Holds moisture\n- Cracks when dry'
function AgricultureManager({ onChange }) {
const [items, setItems] = useState([])
const [form, setForm] = useState(emptyForm)
const [file, setFile] = useState(null)
const [fileKey, setFileKey] = useState(0) // changing this clears the file input
const [editingId, setEditingId] = useState(null)
const [saving, setSaving] = useState(false)
const [message, setMessage] = useState('')
const [error, setError] = useState('')
const loadItems = useCallback(() => {
getAgriculture()
.then(setItems)
.catch((err) => setError(err.message))
}, [])
useEffect(() => {
loadItems()
}, [loadItems])
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
data.append('category', form.category)
data.append('name', form.name)
data.append('content', form.content)
if (file) data.append('image', file)
try {
if (editingId) await updateAgriculture(editingId, data)
else await createAgriculture(data)
setMessage(editingId ? 'Updated successfully' : 'Added successfully')
resetForm()
loadItems()
onChange?.()
} catch (err) {
setError(err.message)
} finally {
setSaving(false)
}
}
function startEdit(item) {
setEditingId(item.id)
setForm({ category: item.category, name: item.name, content: item.content })
setFile(null)
setFileKey((k) => k + 1)
setMessage('')
window.scrollTo({ top: 0, behavior: 'smooth' })
}
async function handleDelete(item) {
if (!window.confirm(`Delete "${item.name}"?`)) return
try {
await deleteAgriculture(item.id)
loadItems()
onChange?.()
} catch (err) {
setError(err.message)
}
}
return (
<div>
<form className="card admin-form" onSubmit={handleSubmit}>
<h3>{editingId ? 'Edit agriculture item' : 'Add agriculture item'}</h3>
<div className="field">
<label>Section</label>
<select name="category" value={form.category} onChange={handleChange}>
{categories.map((c) => (
<option key={c.value} value={c.value}>{c.label}</option>
))}
</select>
</div>
<div className="field">
<label>Name</label>
<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="e.g. Black Soil (Regur)"
required
/>
</div>
<div className="field">
<label>Content</label>
<textarea
name="content"
rows="6"
value={form.content}
onChange={handleChange}
placeholder={contentHint}
required
/>
<small className="muted">
Tip: one point per line. Start a line with "- " for a bullet.
Use "Label: text" to make the label bold.
</small>
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
{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
</button>
{editingId && (
<button type="button" className="btn btn-outline" onClick={resetForm}>
Cancel
</button>
)}
</div>
</form>
<div className="admin-list">
{items.length === 0 && <p className="muted">No items yet.</p>}
{items.map((item) => (
<div className="admin-row" key={item.id}>
{item.image ? (
<img className="thumb" src={item.image} alt={item.name} />
) : (
<div className="thumb" />
)}
<div className="grow">
<strong>{item.name}</strong>
<div><span className="badge">{item.category}</span></div>
</div>
<div className="actions">
<button className="btn btn-small btn-outline" onClick={() => startEdit(item)}>
Edit
</button>
<button className="link-btn" onClick={() => handleDelete(item)}>
Delete
</button>
</div>
</div>
))}
</div>
</div>
)
}
export default AgricultureManager