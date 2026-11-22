import cloudinary from '../config/cloudinary.js'
// Sends an image buffer (from multer) to Cloudinary.
// Returns { url, publicId }.
export function uploadImage(buffer, folder) {
return new Promise((resolve, reject) => {
const stream = cloudinary.uploader.upload_stream(
{ folder: `leafcare/${folder}`, resource_type: 'image' },
(error, result) => {
if (error) return reject(error)
resolve({ url: result.secure_url, publicId: result.public_id })
}
)
stream.end(buffer)
})
}
export async function deleteImage(publicId) {
if (!publicId) return
try {
await cloudinary.uploader.destroy(publicId)
} catch (err) {
console.error('Cloudinary delete failed:', err.message)
}
}