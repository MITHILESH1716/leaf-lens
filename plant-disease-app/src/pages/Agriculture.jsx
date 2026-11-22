import { useState, useEffect } from 'react'
import ImageBox from '../components/ImageBox'
import { soils, crops, seasons, regions, climateNote } from '../data/maharashtra'
import { getAgriculture } from '../services/api'
const tabs = ['Soils', 'Crops', 'Climate', 'Regions']
// which database category each tab shows, and the image height (same as before)
const tabInfo = {
Soils: { category: 'soil', height: 160 },
Crops: { category: 'crop', height: 140 },
Climate: { category: 'climate', height: 140 },
Regions: { category: 'region', height: 140 },
}
// Turns the admin's text into the same look as the old cards:
// - "Label: text" -> bold label
// - lines starting with "- " -> bullet list
function renderContent(content) {
const blocks = []
let list = null
content.split('\n').forEach((raw) => {
const line = raw.trim()
if (!line) return
if (line.startsWith('- ')) {
if (!list) {
list = []
blocks.push({ type: 'list', items: list })
}
list.push(line.slice(2))
} else {
list = null
blocks.push({ type: 'text', text: line })
}
})
return blocks.map((block, i) => {
if (block.type === 'list') {
return (
<ul className="list" key={i}>
{block.items.map((item, j) => <li key={j}>{item}</li>)}
</ul>
)
}
const match = block.text.match(/^([A-Za-z ]{2,20}):\s+(.*)$/)
return (
<p className="info-line" key={i}>
{match ? <><strong>{match[1]}:</strong> {match[2]}</> : block.text}
</p>
)
})
}
// Cards built from MongoDB data
function DbCards({ items, height }) {
if (items.length === 0) {
return <p className="muted empty-state">Nothing added here yet.</p>
}
return (
<div className="cards">
{items.map((item) => (
<div className="card" key={item.id}>
<ImageBox src={item.image} label={item.name} height={height} />
<h3>{item.name}</h3>
{renderContent(item.content)}
</div>
))}
</div>
)
}
// The original hard-coded content. Only shown if the server can't be reached.
function StaticContent({ activeTab }) {
return (
  <>
{activeTab === 'Soils' && (
<div className="cards">
{soils.map((soil) => (
<div className="card" key={soil.id}>
<ImageBox src={soil.image} label={soil.name} height={160} />
<h3>{soil.name}</h3>
<p className="muted">Also called: {soil.alsoCalled}</p>
<p className="info-line"><strong>Found in:</strong> {soil.whereFound}</p>
<ul className="list">
{soil.features.map((f) => <li key={f}>{f}</li>)}
</ul>
<div className="tags">
{soil.bestCrops.map((c) => <span className="tag" key={c}>{c}</span>)}
</div>
</div>
))}
</div>
)}
{activeTab === 'Crops' && (
<div className="cards">
{crops.map((crop) => (
<div className="card" key={crop.id}>
<ImageBox src={crop.image} label={crop.name} height={140} />
<h3>{crop.name}</h3>
<span className="badge">{crop.type}</span>
<p className="info-line"><strong>Season:</strong> {crop.season}</p>
<p className="info-line"><strong>Grown in:</strong> {crop.grownIn}</p>
</div>
))}
</div>
)}
{activeTab === 'Climate' && (
<>
<div className="cards">
{seasons.map((s) => (
<div className="card" key={s.id}>
<h3>{s.name}</h3>
<span className="badge">{s.months}</span>
<p className="info-line">{s.description}</p>
<p className="info-line"><strong>{s.cropSeason}</strong></p>
</div>
))}
</div>
<div className="card note">
<ImageBox label="Rainfall map of Maharashtra" height={220} />
<h3>Rainfall across the state</h3>
<p className="muted">{climateNote}</p>
</div>
</>
)}
{activeTab === 'Regions' && (
<div className="cards">
{regions.map((r) => (
<div className="card" key={r.id}>
<ImageBox src={r.image} label={r.name} height={140} />
<h3>{r.name}</h3>
<p className="info-line"><strong>Districts:</strong> {r.districts}</p>
<p className="info-line"><strong>Soil:</strong> {r.soil}</p>
<p className="info-line"><strong>Climate:</strong> {r.climate}</p>
<div className="tags">
{r.mainCrops.map((c) => <span className="tag" key={c}>{c}</span>)}
</div>
</div>
))}
</div>
)}
</>
)
}
function Agriculture() {
const [activeTab, setActiveTab] = useState('Soils')
const [items, setItems] = useState([])
const [status, setStatus] = useState('loading') // loading | ok | error
useEffect(() => {
getAgriculture()
.then((data) => {
setItems(data)
setStatus('ok')
})
.catch(() => setStatus('error'))
}, [])
const { category, height } = tabInfo[activeTab]
return (
<section>
<h1>Agriculture in Maharashtra</h1>
<p className="muted">Soils, crops, climate and regions that shape farming in the state.</p>
<div className="tabs">
{tabs.map((tab) => (
<button
key={tab}
className={activeTab === tab ? 'tab active' : 'tab'}
onClick={() => setActiveTab(tab)}
>
{tab}
</button>
))}
</div>
{status === 'loading' && <p className="muted empty-state">Loading...</p>}
{status === 'ok' && (
<DbCards items={items.filter((i) => i.category === category)} height={height} />
)}
{status === 'error' && <StaticContent activeTab={activeTab} />}
</section>
)
}
export default Agriculture