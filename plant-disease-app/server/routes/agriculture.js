import express from 'express'
import AgricultureItem from '../models/AgricultureItem.js'
import { protect, adminOnly } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { uploadImage, deleteImage } from '../utils/cloudinaryUpload.js'
const router = express.Router()
// GET /api/agriculture?category=soil (public - the website uses this)
router.get('/', async (req, res) => {
try {
const filter = req.query.category ? { category: req.query.category } : {}
const items = await AgricultureItem.find(filter).sort({ createdAt: 1 })
res.json(items)
} catch (err) {
res.status(500).json({ message: err.message })
}
})
// POST /api/agriculture (admin) - form-data: category, name, content, image
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
try {
const { category, name, content } = req.body
const data = { category, name, content }
if (req.file) {
const img = await uploadImage(req.file.buffer, 'agriculture')
data.image = img.url
data.imagePublicId = img.publicId
}
const item = await AgricultureItem.create(data)
res.status(201).json(item)
} catch (err) {
res.status(400).json({ message: err.message })
}
})
// PUT /api/agriculture/:id (admin) - image is optional here
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
try {
const item = await AgricultureItem.findById(req.params.id)
if (!item) return res.status(404).json({ message: 'Item not found' })
const { category, name, content } = req.body
if (category) item.category = category
if (name) item.name = name
if (content) item.content = content
if (req.file) {
await deleteImage(item.imagePublicId)
const img = await uploadImage(req.file.buffer, 'agriculture')
item.image = img.url
item.imagePublicId = img.publicId
}
await item.save()
res.json(item)
} catch (err) {
res.status(400).json({ message: err.message })
}
})
// DELETE /api/agriculture/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
try {
const item = await AgricultureItem.findByIdAndDelete(req.params.id)
if (!item) return res.status(404).json({ message: 'Item not found' })
await deleteImage(item.imagePublicId)
res.json({ message: 'Deleted' })
} catch (err) {
res.status(500).json({ message: err.message })
}
})
export default router