import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from 'node:process'
import User from '../models/User.js'

const router = express.Router()

const CITIES = [
  'Mumbai',
  'Pune',
  'Nagpur',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Ratnagiri',
  'Kolhapur',
  'Jalgaon',
  'Dharashiv',
  'Akola',
]

function makeToken(user) {
  return jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

function sendUser(res, user, status = 200) {
  res.status(status).json({
    token: makeToken(user),
    user: {
      id: user._id,
      name: user.name,
      username: user.username || '',
      email: user.email,
      role: user.role,
      address: user.address,
      profilePicture: user.profilePicture || '',
    },
  })
}

router.post('/register', async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      address,
    } = req.body

    if (
      !name?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password ||
      !address?.building?.trim() ||
      !address?.area?.trim() ||
      !CITIES.includes(address?.city)
    ) {
      return res.status(400).json({
        message: 'Please complete all registration fields',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      })
    }

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    const existing = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername },
      ],
    })

    if (existing) {
      return res.status(409).json({
        message: 'Email or username is already registered',
      })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: hashed,
      role: 'user',
      address: {
        building: address.building.trim(),
        area: address.area.trim(),
        city: address.city,
        state: 'Maharashtra',
      },
    })

    sendUser(res, user, 201)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase()
    const { password } = req.body

    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    sendUser(res, user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router