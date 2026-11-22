import 'dotenv/config'
import process from 'node:process'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
async function run() {
await mongoose.connect(process.env.MONGO_URI)
const email = (process.env.ADMIN_EMAIL || 'admin@leafcare.com').toLowerCase()
const exists = await User.findOne({ email })
if (exists) {
console.log('Admin already exists:', email)
} else {
const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10)
await User.create({
name: process.env.ADMIN_NAME || 'Administrator',
email,
password: hashed,
role: 'admin',
})
console.log('Admin created:', email)
}
await mongoose.disconnect()
}
run().catch((err) => {
console.error(err.message)
process.exit(1)
})