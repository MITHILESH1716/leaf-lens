import express from 'express'
import Product from '../models/Product.js'
import { protect, adminOnly } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { uploadImage, deleteImage } from '../utils/cloudinaryUpload.js'

const router = express.Router()

// GET /api/products?category=Fungicide (public - the shop uses this)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {}
    const products = await Product.find(filter).sort({ createdAt: 1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/products (admin) - form-data
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, unit, description, usedFor } = req.body
    const data = { name, category, price: Number(price), unit, description, usedFor }
    if (req.file) {
      const img = await uploadImage(req.file.buffer, 'products')
      data.image = img.url
      data.imagePublicId = img.publicId
    }
    const product = await Product.create(data)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/products/:id (admin)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const fields = ['name', 'category', 'unit', 'description', 'usedFor']
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f]
    })
    if (req.body.price !== undefined) product.price = Number(req.body.price)

    if (req.file) {
      await deleteImage(product.imagePublicId)
      const img = await uploadImage(req.file.buffer, 'products')
      product.image = img.url
      product.imagePublicId = img.publicId
    }
    await product.save()
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    await deleteImage(product.imagePublicId)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router