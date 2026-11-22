import { useState, useEffect } from 'react'
import supplements from '../data/supplements'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/api'
function Shop() {
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [category, setCategory] = useState('All')
const [search, setSearch] = useState('')
useEffect(() => {
getProducts()
.then((data) => setProducts(data))
.catch(() => setProducts(supplements)) // server down: show the sample data
.finally(() => setLoading(false))
}, [])
// build the filter buttons from the data itself
const categories = ['All', ...new Set(products.map((s) => s.category))]
const shown = products.filter((item) => {
const matchesCategory = category === 'All' || item.category === category
const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
return matchesCategory && matchesSearch
})
return (
<section>
<h1>Organic Supplements Shop</h1>
<p className="muted">Soils, compost and natural treatments to keep your plants healthy.</p>
<div className="filters">
{categories.map((c) => (
<button
key={c}
className={category === c ? 'tab active' : 'tab'}
onClick={() => setCategory(c)}
>
{c}
</button>
))}
</div>
<input
className="search"
placeholder="Search products..."
value={search}
onChange={(e) => setSearch(e.target.value)}
/>
{loading ? (
<p className="muted empty-state">Loading...</p>
) : shown.length === 0 ? (
<p className="muted empty-state">No products found.</p>
) : (
<div className="products">
{shown.map((item) => <ProductCard key={item.id} product={item} />)}
</div>
)}
</section>
)
}
export default Shop