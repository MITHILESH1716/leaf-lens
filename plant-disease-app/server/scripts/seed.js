// Copies the sample data already in src/data/ into MongoDB, so the admin can
// edit it. Run once: npm run seed
// It only inserts when the collection is empty, so it is safe to re-run.
import 'dotenv/config'
import process from 'node:process'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import AgricultureItem from '../models/AgricultureItem.js'
import supplements from '../../src/data/supplements.js'
import { soils, crops, seasons, regions, climateNote } from '../../src/data/maharashtra.js'
const bullets = (list) => list.map((x) => `- ${x}`).join('\n')
const agriculture = [
...soils.map((s) => ({
category: 'soil',
name: s.name,
content: [
`Also called: ${s.alsoCalled}`,
`Found in: ${s.whereFound}`,
bullets(s.features),
`Best crops: ${s.bestCrops.join(', ')}`,
].join('\n'),
})),
...crops.map((c) => ({
category: 'crop',
name: c.name,
content: `Type: ${c.type}\nSeason: ${c.season}\nGrown in: ${c.grownIn}`,
})),
...seasons.map((s) => ({
category: 'climate',
name: s.name,
content: `${s.months}\n${s.description}\n${s.cropSeason}`,
})),
{ category: 'climate', name: 'Rainfall across the state', content: climateNote },
...regions.map((r) => ({
category: 'region',
name: r.name,
content: [
`Districts: ${r.districts}`,
`Soil: ${r.soil}`,
`Climate: ${r.climate}`,
`Main crops: ${r.mainCrops.join(', ')}`,
].join('\n'),
})),
]
async function run() {
await mongoose.connect(process.env.MONGO_URI)
if ((await Product.countDocuments()) === 0) {
await Product.insertMany(supplements.map((supplement) => {
const rest = { ...supplement }
delete rest.id
return rest
}))
console.log('Products seeded:', supplements.length)
} else {
console.log('Products already exist - skipped')
}
if ((await AgricultureItem.countDocuments()) === 0) {
await AgricultureItem.insertMany(agriculture)
console.log('Agriculture items seeded:', agriculture.length)
} else {
console.log('Agriculture items already exist - skipped')
}
await mongoose.disconnect()
}
run().catch((err) => {
console.error(err.message)
process.exit(1)
})