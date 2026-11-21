import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import diseases from '../data/diseases'

// ---------------------------------------------------------------------------
// Settings – change these if you want a different model or setup
// ---------------------------------------------------------------------------
const OLLAMA_URL = 'http://localhost:11434/api/chat'

// 2B (~1.9 GB) fits completely inside the RTX 3050's 4 GB, so it runs 100% on the GPU.
// The 4B (~3.3 GB) plus image encoder and cache usually does NOT fit in 4 GB, so part of it
// spills to the CPU and becomes slow. Only use the 4B if you have more free VRAM:
//   'qwen3-vl:4b-instruct'
const MODEL = 'qwen3-vl:4b-instruct'

// Ask Ollama to put every layer on the GPU (99 = "as many as the model has").
// If you get an out-of-memory error, lower this or switch to a smaller model.
const GPU_LAYERS = 99

const MAX_IMAGE_SIDE = 512 // photos are shrunk before sending: much faster, less VRAM
const MIN_CONFIDENCE = 40 // below this we say "not sure" instead of guessing
const TIMEOUT_MS = 5 * 60 * 1000 // first scan has to load the model, so be generous

const HEALTHY = 'Healthy'
const UNKNOWN = 'Unknown'

const SUPPORTED_PLANTS = [...new Set(Object.values(diseases).map((d) => d.plant))].join(', ')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Shrinks the photo and returns it as a base64 JPEG (what Ollama expects).
async function imageToBase64(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff' // PNGs with transparency would turn black otherwise
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', 0.9).split(',')[1]
}

// The prompt is built from diseases.js, so adding a disease there
// automatically teaches the model about it. No change needed here.
function buildPrompt() {
  const options = Object.entries(diseases)
    .map(([label, d]) => `- ${label}: ${d.plant} ${d.name}. Signs: ${d.symptoms.join('; ')}.`)
    .join('\n')

  return `You are a plant pathologist. Look at this photo of a plant leaf and pick the ONE option that fits best.

Options:
${options}
- ${HEALTHY}: a leaf of one of the crops above with no visible disease.
- ${UNKNOWN}: ONLY if the image is clearly not a plant leaf, or the crop is clearly not one of the crops above.

First describe the visible symptoms in one short sentence ("observation"). Then give your best "diagnosis" from the options, even if you are not fully sure, and a "confidence" from 0 to 100 that reflects how sure you are.`
}

// Forces the model to answer in exactly this shape, and only with a valid label.
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    observation: { type: 'string' },
    diagnosis: { type: 'string', enum: [...Object.keys(diseases), HEALTHY, UNKNOWN] },
    confidence: { type: 'integer' },
  },
  required: ['observation', 'diagnosis', 'confidence'],
}

// Debug helper: asks Ollama how much of the loaded model sits in GPU memory.
// Look for "[LeafCare] GPU usage" in the browser console (F12).
async function logGpuUsage() {
  try {
    const res = await fetch(OLLAMA_URL.replace('/api/chat', '/api/ps'))
    const { models = [] } = await res.json()
    const m = models.find((x) => x.name.startsWith(MODEL.split(':')[0]))
    if (!m) return
    const pct = Math.round((m.size_vram / m.size) * 100)
    console.log(`[LeafCare] GPU usage: ${pct}% of ${m.name} is on the GPU` + (pct < 100 ? ' (rest is on CPU, so it will be slower)' : ''))
  } catch {
    // purely informational, ignore failures
  }
}

// Sends the image to Ollama and returns { label, confidence } like the old api.js did.
// NOTE: "confidence" is the model's own estimate, not a calibrated probability.
async function detectWithOllama(file) {
  const image = await imageToBase64(file)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response
  try {
    response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        format: RESPONSE_SCHEMA,
        keep_alive: '10m', // keep the model in memory so the next scan is fast
        options: { temperature: 0.2, num_ctx: 3072, num_gpu: GPU_LAYERS }, // temperature 0 can make Qwen-VL return an empty answer
        messages: [{ role: 'user', content: buildPrompt(), images: [image] }],
      }),
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The model took too long to answer. Run "ollama ps" in a terminal: if it shows CPU, switch MODEL to qwen3-vl:2b-instruct.', { cause: err })
    }
    throw new Error('Cannot reach Ollama. Make sure the Ollama app is running on this computer.', { cause: err })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Model not installed. Open a terminal and run: ollama pull ${MODEL}`)
    }
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Ollama returned an error (${response.status}).`)
  }

  const data = await response.json()
  let result
  try {
    result = JSON.parse(data.message.content)
  } catch {
    throw new Error('The model gave an unreadable answer. Please try again.')
  }

  console.log('[LeafCare] model answer:', result) // open F12 > Console to see what the model said
  logGpuUsage()

  const confidence = Math.max(0, Math.min(100, Number(result.confidence) || 0))
  return {
    label: result.diagnosis,
    confidence: confidence.toFixed(1),
    observation: result.observation || '',
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function Detect() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState({ type: '', text: '' })
  const navigate = useNavigate()

  async function handleAnalyze(file, preview) {
    setLoading(true)
    setError('')
    setNotice({ type: '', text: '' })

    try {
      const prediction = await detectWithOllama(file)

      if (prediction.label === HEALTHY && Number(prediction.confidence) >= MIN_CONFIDENCE) {
        setNotice({
          type: 'success',
          text: 'Good news – this leaf looks healthy. We did not spot any disease from our list.',
        })
        return
      }

      // Result.jsx can only show diseases that exist in diseases.js
      const isKnownDisease = Boolean(diseases[prediction.label])
      if (!isKnownDisease || Number(prediction.confidence) < MIN_CONFIDENCE) {
        setNotice({
          type: 'muted',
          text: `We could not match this leaf to a disease we know (${SUPPORTED_PLANTS}). Try a clearer, close-up photo of a single leaf in good light.${prediction.observation ? ` The model saw: "${prediction.observation}"` : ''}`,
        })
        return
      }

      navigate('/result', { state: { prediction, preview } })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="hero">
        <h1>Is your plant sick?</h1>
        <p>Upload a clear photo of a single leaf and we'll tell you the disease, how to treat it, and which products can help.</p>
      </div>
      <UploadBox onAnalyze={handleAnalyze} loading={loading} />
      {loading && <p className="muted center">Analyzing your leaf… the first scan can take up to a minute while the model loads.</p>}
      {error && <p className="error center">{error}</p>}
      {notice.text && <p className={`${notice.type} center`}>{notice.text}</p>}
    </section>
  )
}

export default Detect