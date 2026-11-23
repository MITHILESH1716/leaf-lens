import { useState, useEffect, useCallback } from 'react'
import { getAdminStats } from '../services/api'
import AgricultureManager from '../components/admin/AgricultureManager'
import ProductManager from '../components/admin/ProductManager'
import './AdminDashboard.css'
function AdminDashboard({ user }) {
const [stats, setStats] = useState(null)
const [statsError, setStatsError] = useState('')
const [tab, setTab] = useState('agriculture')
const loadStats = useCallback(() => {
getAdminStats()
.then(setStats)
.catch((err) => setStatsError(err.message))
}, [])
useEffect(() => {
loadStats()
}, [loadStats])
// show a dash until the numbers arrive from the database
const show = (value) => (stats ? value : '-')
return (
<div>
<section className="hero">
<span className="badge">Administrator Panel</span>
<h1>Welcome, {user?.name || 'Administrator'}!</h1>
<p>Manage and monitor your LeafLens platform.</p>
</section>
<div className="stats">
<div className="card stat">
<div className="stat-number">{show(stats?.users)}</div>
<p>Registered Users</p>
</div>
<div className="card stat">
<div className="stat-number">{show(stats?.diseaseRecords)}</div>
<p>Disease Records</p>
</div>
<div className="card stat">
<div className="stat-number">{show(stats?.scans)}</div>
<p>Plant Scans</p>
</div>
<div className="card stat">
<div className="stat-number">{show(stats?.products)}</div>
<p>Products</p>
</div>
</div>
{statsError && <p className="error center">Could not load stats: {statsError}</p>}
<section className="section">
<h2>Manage Website Content</h2>
<div className="tabs admin-tabs">
<button
className={tab === 'agriculture' ? 'tab active' : 'tab'}
onClick={() => setTab('agriculture')}
>
Agriculture Page
</button>
<button
className={tab === 'products' ? 'tab active' : 'tab'}
onClick={() => setTab('products')}
>
Shop Products
</button>
</div>
{tab === 'agriculture' && <AgricultureManager onChange={loadStats} />}
{tab === 'products' && <ProductManager onChange={loadStats} />}
</section>
</div>
)
}
export default AdminDashboard