import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
cloud_name: globalThis.process.env.CLOUDINARY_CLOUD_NAME,
api_key: globalThis.process.env.CLOUDINARY_API_KEY,
api_secret: globalThis.process.env.CLOUDINARY_API_SECRET,
})
export default cloudinary