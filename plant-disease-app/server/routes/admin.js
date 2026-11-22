import express from 'express'
import User from '../models/User.js'
import Scan from '../models/Scan.js'
import Product from '../models/Product.js'
import AgricultureItem from '../models/AgricultureItem.js'
import { protect, adminOnly } from '../middleware/auth.js'
const router = express.Router()
// GET /api/admin/stats (admin) - real numbers for the dashboard cards
router.get('/stats', protect, adminOnly, async (req, res) => {
try {
const [users, scans, diseaseRecords, products, agricultureItems] = await Promise.all([
User.countDocuments({ role: 'user' }),
Scan.countDocuments(),
Scan.countDocuments({ isDiseased: true }),
Product.countDocuments(),
AgricultureItem.countDocuments(),
])
res.json({ users, scans, diseaseRecords, products, agricultureItems })
} catch (err) {
res.status(500).json({ message: err.message })
}
})
export default router