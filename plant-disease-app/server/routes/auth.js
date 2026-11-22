import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from 'node:process'
import User from '../models/User.js'
const router = express.Router()
function makeToken(user) {
return jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' })
}
function sendUser(res, user, status = 200) {
res.status(status).json({
token: makeToken(user),
user: { id: user._id, name: user.name, email: user.email, role: user.role },
})
}
// POST /api/auth/register (always creates a normal "user")
router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body
if (!name || !email || !password) {
return res.status(400).json({ message: 'Name, email and password are required' })
}
if (password.length < 6) {
return res.status(400).json({ message: 'Password must be at least 6 characters' })
}
const exists = await User.findOne({ email: email.toLowerCase() })
if (exists) return res.status(409).json({ message: 'This email is already registered' })
const hashed = await bcrypt.hash(password, 10)
const user = await User.create({ name, email, password: hashed, role: 'user' })
sendUser(res, user, 201)
} catch (err) {
res.status(500).json({ message: err.message })
}
})
// POST /api/auth/login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body
const user = await User.findOne({ email: (email || '').toLowerCase() })
if (!user || !(await bcrypt.compare(password || '', user.password))) {
return res.status(401).json({ message: 'Invalid email or password' })
}
sendUser(res, user)
} catch (err) {
res.status(500).json({ message: err.message })
}
})
export default router