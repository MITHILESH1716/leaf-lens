import 'dotenv/config'
import process from 'node:process'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import agricultureRoutes from './routes/agriculture.js'
import productRoutes from './routes/products.js'
import scanRoutes from './routes/scans.js'
import adminRoutes from './routes/admin.js'
const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/agriculture', agricultureRoutes)
app.use('/api/products', productRoutes)
app.use('/api/scans', scanRoutes)
app.use('/api/admin', adminRoutes)
// catches multer errors (wrong file type / too big) and anything else
app.use((err, req, res) => {
console.error(err.message)
res.status(400).json({ message: err.message })
})
const PORT = process.env.PORT || 5000
connectDB().then(() => {
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
})