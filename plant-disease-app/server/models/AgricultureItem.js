import mongoose from 'mongoose'
const agricultureSchema = new mongoose.Schema(
{
category: {
type: String,
enum: ['soil', 'crop', 'climate', 'region'],
required: true,
},
name: { type: String, required: true, trim: true },
content: { type: String, required: true },
image: { type: String, default: '' },
imagePublicId: { type: String, default: '' },
},
{ timestamps: true }
)
// make the API send "id" (the website code already uses item.id)
agricultureSchema.set('toJSON', {
virtuals: true,
versionKey: false,
transform: (doc, ret) => {
delete ret._id
delete ret.imagePublicId
return ret
},
})
export default mongoose.model('AgricultureItem', agricultureSchema)