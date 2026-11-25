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
import orderRoutes from './routes/orders.js'
import profileRoutes from './routes/profile.js'

const app = express()

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.PAYMENT_PAGE_URL || 'https://leaflens-payment.netlify.app',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/agriculture', agricultureRoutes)
app.use('/api/products', productRoutes)
app.use('/api/scans', scanRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/profile', profileRoutes)

app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(400).json({ message: err.message })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})