import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import diseases from '../data/diseases'
import { predictDisease, saveScan } from '../services/api'
function Detect() {
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const navigate = useNavigate()
async function handleAnalyze(file, preview) {
setLoading(true)
setError('')
try {
const prediction = await predictDisease(file)
// record the scan in MongoDB (if this fails the user still sees the result)
const info = diseases[prediction.label]
saveScan({
label: prediction.label,
plant: info?.plant,
diseaseName: info?.name,
confidence: prediction.confidence,
}).catch(() => {})
navigate('/result', { state: { prediction, preview } })
} catch {
setError('Something went wrong. Please try again.')
} finally {
setLoading(false)
}
}
return (
<section>
<div className="hero">
<h1>Is your plant sick?</h1>
<p>Upload a clear photo of a single leaf and we'll tell you the disease, how to treat it, and which
products can help.</p>
</div>
<UploadBox onAnalyze={handleAnalyze} loading={loading} />
{error && <p className="error center">{error}</p>}
</section>
)
}
export default Detect