import express from 'express'
import Scan from '../models/Scan.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()
// POST /api/scans (logged-in user) - called after every detection
router.post('/', protect, async (req, res) => {
try {
const { label, plant, diseaseName, confidence } = req.body
const isDiseased = !/healthy/i.test(label || '')
const scan = await Scan.create({
user: req.user._id,
label,
plant,
diseaseName,
confidence: Number(confidence) || 0,
isDiseased,
})
res.status(201).json(scan)
} catch (err) {
res.status(400).json({ message: err.message })
}
})
export default router