import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    delivery: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },

    paymentMethod: {
      type: String,
      default: 'DEMO_UPI',
    },

    paymentToken: {
      type: String,
      required: true,
      unique: true,
    },

    paymentReference: {
      type: String,
      default: '',
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
