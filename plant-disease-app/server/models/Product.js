import mongoose from 'mongoose'
export const PRODUCT_CATEGORIES = [
'Fungicide',
'Organic Pesticide',
'Fertilizer',
'Soil & Compost',
]
const productSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
category: { type: String, enum: PRODUCT_CATEGORIES, required: true },
price: { type: Number, required: true, min: 0 },
unit: { type: String, default: '', trim: true },
description: { type: String, default: '' },
usedFor: { type: String, default: '' },
image: { type: String, default: '' },
imagePublicId: { type: String, default: '' },
},
{ timestamps: true }
)
productSchema.set('toJSON', {
virtuals: true,
versionKey: false,
transform: (doc, ret) => {
delete ret._id
delete ret.imagePublicId
return ret
},
})
export default mongoose.model('Product', productSchema)