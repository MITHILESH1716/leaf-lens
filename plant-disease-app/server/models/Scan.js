import mongoose from 'mongoose'
const scanSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
label: { type: String, required: true }, // e.g. Tomato___Late_blight
plant: { type: String, default: '' },
diseaseName: { type: String, default: '' },
confidence: { type: Number, default: 0 },
isDiseased: { type: Boolean, default: true },
},
{ timestamps: true }
)
export default mongoose.model('Scan', scanSchema)
