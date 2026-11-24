import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    address: {
      building: { type: String, default: '' },
      area: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: 'Maharashtra' },
    },

    profilePicture: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)