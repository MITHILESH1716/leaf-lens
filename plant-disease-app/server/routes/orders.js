import express from 'express'
import crypto from 'node:crypto'

import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// POST /api/orders
// Create a new pending order
router.post('/', protect, async (req, res) => {
  try {
    const { items, delivery } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Your cart is empty',
      })
    }

    if (
      !delivery?.name?.trim() ||
      !delivery?.phone?.trim() ||
      !delivery?.address?.trim()
    ) {
      return res.status(400).json({
        message: 'Please provide all delivery details',
      })
    }

    const phone = delivery.phone.trim()

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: 'Enter a valid 10-digit mobile number',
      })
    }

    // Validate quantities and product IDs
    for (const item of items) {
      if (
        !mongooseIdIsValid(item.id) ||
        !Number.isInteger(Number(item.qty)) ||
        Number(item.qty) < 1 ||
        Number(item.qty) > 99
      ) {
        return res.status(400).json({
          message: 'Invalid cart item or quantity',
        })
      }
    }

    // Fetch actual products and prices from MongoDB
    const productIds = [...new Set(items.map((item) => item.id))]

    const products = await Product.find({
      _id: { $in: productIds },
    })

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: 'One or more products are unavailable',
      })
    }

    const orderItems = items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.id
      )

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: Number(item.qty),
      }
    })

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const paymentToken = crypto.randomBytes(32).toString('hex')

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      delivery: {
        name: delivery.name.trim(),
        phone,
        address: delivery.address.trim(),
      },
      totalAmount,
      paymentStatus: 'pending',
      paymentMethod: 'DEMO_UPI',
      paymentToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id,
      paymentToken: order.paymentToken,
      totalAmount: order.totalAmount,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

// Helper to validate MongoDB IDs
function mongooseIdIsValid(id) {
  return typeof id === 'string' &&
    /^[a-fA-F0-9]{24}$/.test(id)
}

// GET /api/orders/demo-payment/:token
// Fetch order details for the payment page
router.get('/demo-payment/:token', async (req, res) => {
  try {
    const order = await Order.findOne({
      paymentToken: req.params.token,
    })

    if (!order) {
      return res.status(404).json({
        message: 'Payment link not found',
      })
    }

    if (order.expiresAt < new Date() &&
        order.paymentStatus === 'pending') {
      return res.status(410).json({
        message: 'Payment link has expired',
      })
    }

    res.json({
      orderId: order._id,
      items: order.items,
      delivery: order.delivery,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      expiresAt: order.expiresAt,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

// POST /api/orders/demo-payment/:token/pay
// Simulate successful payment
router.post('/demo-payment/:token/pay', async (req, res) => {
  try {
    const order = await Order.findOne({
      paymentToken: req.params.token,
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    if (order.paymentStatus === 'paid') {
      return res.json({
        message: 'Payment already completed',
        paymentStatus: 'paid',
        paymentReference: order.paymentReference,
      })
    }

    if (order.expiresAt < new Date()) {
      return res.status(410).json({
        message: 'Payment link has expired',
      })
    }

    const paymentReference =
      'DEMO' + crypto.randomBytes(6).toString('hex').toUpperCase()

    // Only one request can change pending to paid
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        paymentStatus: 'pending',
        expiresAt: { $gt: new Date() },
      },
      {
        $set: {
          paymentStatus: 'paid',
          paymentReference,
        },
      },
      { new: true }
    )

    if (!updatedOrder) {
      return res.status(409).json({
        message: 'Payment could not be completed. Please check order status.',
      })
    }

    res.json({
      message: 'Demo payment successful',
      paymentStatus: updatedOrder.paymentStatus,
      paymentReference: updatedOrder.paymentReference,
      orderId: updatedOrder._id,
      totalAmount: updatedOrder.totalAmount,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

// GET /api/orders/:id/status
// Check order status from the cart page
router.get('/:id/status', protect, async (req, res) => {
  try {
    if (!mongooseIdIsValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid order ID',
      })
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      paymentReference: order.paymentReference,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

export default router
