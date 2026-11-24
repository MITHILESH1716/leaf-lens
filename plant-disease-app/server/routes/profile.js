import express from 'express'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { protect } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { uploadImage } from '../utils/cloudinaryUpload.js'

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

// Get profile
router.get('/', protect, async (req, res) => {
  res.json({
    user: {
      name: req.user.name,
      username: req.user.username || '',
      email: req.user.email,
      address: req.user.address,
      profilePicture: req.user.profilePicture || '',
    },
  })
})

// Update name, username and address
router.put('/', protect, async (req, res) => {
  try {
    const { name, username, address } = req.body

    if (!name?.trim() || !username?.trim()) {
      return res.status(400).json({
        message: 'Name and username are required',
      })
    }

    if (
      !address?.building?.trim() ||
      !address?.area?.trim() ||
      !CITIES.includes(address?.city)
    ) {
      return res.status(400).json({
        message: 'Please enter a valid address and city',
      })
    }

    const cleanUsername = username.trim().toLowerCase()

    const existing = await User.findOne({
      username: cleanUsername,
      _id: { $ne: req.user._id },
    })

    if (existing) {
      return res.status(409).json({
        message: 'This username is already taken',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name: name.trim(),
          username: cleanUsername,
          address: {
            building: address.building.trim(),
            area: address.area.trim(),
            city: address.city,
            state: 'Maharashtra',
          },
        },
      },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      message: 'Profile updated successfully',
      user,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Upload profile picture
router.post('/picture', protect, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please select an image',
      })
    }

    const result = await uploadImage(req.file.buffer, 'profiles')

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: result.url },
      { new: true }
    ).select('-password')

    res.json({
      message: 'Profile picture updated',
      profilePicture: user.profilePicture,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get this user's completed order history
router.get('/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      paymentStatus: 'paid',
    })
      .sort({ createdAt: -1 })
      .select('items totalAmount createdAt paymentStatus')

    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router