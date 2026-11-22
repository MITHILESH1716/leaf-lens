import jwt from 'jsonwebtoken'
import process from 'node:process'
import User from '../models/User.js'

// Any logged-in user
export async function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Please log in first' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User no longer exists' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Session expired, please log in again' })
  }
}

// Only admins (use after protect)
export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' })
  }
  next()
}
