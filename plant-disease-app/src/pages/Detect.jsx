import { useState } from 'react'
import { Link } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import supplements from '../data/supplements'
import { findPlant, rankProblems, generalAdvice, DISCLAIMER } from '../data/plantCare'

// ---------------------------------------------------------------------------
// Settings (same values as public/plant-test.html)
// ---------------------------------------------------------------------------
const OLLAMA = 'http://127.0.0.1:11434'
const MODEL = 'qwen3-vl:4b-instruct'
const MAX_SIDE = 768 // photo is shrunk to this before sending
const TIMEOUT_MS = 5 * 60 * 1000

// The model must answer in exactly this shape.
const SCHEMA = {
  type: 'object',
  properties: {
    is_plant_leaf: { type: 'boolean' },
    leaf_features: { type: 'string' },
    plant_name: { type: 'string' },
    other_possibilities: { type: 'array', items: { type: 'string' } },
    looks_healthy: { type: 'boolean' },
    symptoms: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'integer' },
  },
  required: ['is_plant_leaf', 'leaf_features', 'plant_name', 'other_possibilities', 'looks_healthy', 'symptoms', 'confidence'],
}

const PROMPT = `You are an experienced botanist and plant pathologist. Look carefully at this photo.
1. is_plant_leaf: does it show a plant leaf?
2. leaf_features: in one sentence describe the leaf SHAPE (lobed, oval, heart-shaped, serrated edge, compound...), vein pattern, size relative to the frame and surface texture.
3. plant_name: using those features, give the common name of the plant. You MUST give your single best guess, like "Grape", "Apple", "Tomato" or "Rose". Never answer "Unknown", "Not sure" or leave it empty.
4. other_possibilities: up to 2 other plants it could be, most likely first.
5. looks_healthy: does the leaf look healthy?
6. symptoms: list ONLY symptoms you can actually see (colour changes, spots with their colour/shape/size, edges, holes, curling, fuzz). 2 to 6 short points. Empty list if healthy.
7. confidence: 0 to 100 for the plant name.
Do not name a disease. Describe only what is visible.`

// ---------------------------------------------------------------------------
// Talking to the model
// ---------------------------------------------------------------------------
async function toBase64(file) {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  return canvas.toDataURL('image/jpeg', 0.9).split(',')[1]
}

async function askModel(file) {
  const image = await toBase64(file)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res
  try {
    res = await fetch(OLLAMA + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        format: SCHEMA,
        keep_alive: '10m',
        options: { temperature: 0.2, num_ctx: 4096 },
        messages: [{ role: 'user', content: PROMPT, images: [image] }],
      }),
    })
  } catch (err) {
    throw new Error(
      err.name === 'AbortError'
        ? 'The model took too long. Run "ollama ps" and check whether it is running on the CPU.'
        : 'Cannot reach Ollama. Start it first (ollama-start.bat) and try again.',
      { cause: err },
    )
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    if (res.status === 404) throw new Error(`Model not installed. Run: ollama pull ${MODEL}`)
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Ollama error ${res.status}`)
  }

  const data = await res.json()
  let parsed
  try {
    parsed = JSON.parse(data.message.content)
  } catch {
    throw new Error('The model gave an unreadable answer. Please try again.')
  }

  console.log('[LeafCare] model answer:', parsed)
  parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 0))
  return parsed
}

// ---------------------------------------------------------------------------
// Result view (same card layout as the old Result page)
// ---------------------------------------------------------------------------
function ResultView({ result, onReset }) {
  const { answer, plant, problems, product, healthy, preview } = result
  const symptoms = answer.symptoms || []

  return (
    <section className="result-grid">
      <div className="card">
        <img src={preview} alt="Uploaded leaf" className="preview" />
        <p className="muted">Uploaded image</p>
      </div>

      <div className="card">
        <span className="badge">{plant ? 'Supported plant' : 'Not in our plant list yet'}</span>
        <h2>{plant ? plant.name : answer.plant_name || 'Unknown plant'}</h2>
        <p className="confidence">Confidence: {answer.confidence}% (the model's own estimate)</p>
        {answer.other_possibilities?.length > 0 && (
          <p className="muted">Could also be: {answer.other_possibilities.join(', ')}</p>
        )}

        <h3>{healthy ? 'Leaf condition' : 'Symptoms'}</h3>
        {healthy ? (
          <p>This leaf looks healthy. No problem symptoms were spotted.</p>
        ) : (
          <ul className="list">
            {symptoms.map((s, i) => <li key={`${i}-${s}`}>{s}</li>)}
          </ul>
        )}

        {!healthy && problems.length > 0 && (
          <>
            <h3>Possible problems (matched from the symptoms)</h3>
            {problems.map((p) => (
              <div className="suggest" key={p.name} style={{ marginBottom: 12 }}>
                <strong>{p.name}</strong>
                <p className="muted">{p.signs}</p>
                <ul className="list">
                  {p.treatment.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        <h3>{healthy || problems.length === 0 ? 'Care and general advice' : 'General care'}</h3>
        <ul className="list">
          {(plant ? plant.care : []).map((c) => <li key={c}>{c}</li>)}
          {!healthy && (problems.length === 0 || !plant) && generalAdvice.map((g) => <li key={g}>{g}</li>)}
        </ul>

        {product && (
          <p className="suggest">
            Suggested product: <strong>{product.name}</strong> (₹{product.price})
          </p>
        )}

        <p className="muted" style={{ fontSize: '0.85rem' }}>{DISCLAIMER}</p>

        <div className="btn-row">
          <button className="btn" onClick={onReset}>Scan another leaf</button>
          <Link to="/shop" className="btn btn-outline">Buy treatment</Link>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
function Detect() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [result, setResult] = useState(null)

  async function handleAnalyze(file, preview) {
    setLoading(true)
    setError('')
    setNotice('')

    try {
      const answer = await askModel(file)

      if (!answer.is_plant_leaf) {
        setNotice('This does not look like a plant leaf. Please upload a clear, close-up photo of a single leaf.')
        return
      }

      const plant = findPlant(answer.plant_name)
      const symptoms = answer.symptoms || []
      const healthy = answer.looks_healthy && symptoms.length === 0

      // Compare the visible symptoms with the known problems of this plant
      const problems = plant && !healthy ? rankProblems(plant, [...symptoms, answer.leaf_features || '']) : []
      const product = supplements.find((s) => s.id === problems[0]?.productId)

      setResult({ answer, plant, problems, product, healthy, preview })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) return <ResultView result={result} onReset={() => setResult(null)} />

  return (
    <section>
      <div className="hero">
        <h1>Is your plant sick?</h1>
        <p>Upload a clear photo of a single leaf and we'll tell you the plant, the symptoms, how to treat it, and which products can help.</p>
      </div>
      <UploadBox onAnalyze={handleAnalyze} loading={loading} />
      {loading && <p className="muted center">Analyzing your leaf… the first scan can take up to a minute while the model loads.</p>}
      {error && <p className="error center">{error}</p>}
      {notice && <p className="muted center">{notice}</p>}
    </section>
  )
}

export default Detect