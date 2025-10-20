import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'

export default function Products(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [size, setSize] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState([0, 50])

  const load = async () => {
    setLoading(true)
    const params = {}
    if (q) params.q = q
    if (size) params.size = size
    if (type) params.type = type
    if (price[0] > 0) params.minPrice = price[0]
    if (price[1] < 50) params.maxPrice = price[1]
    const { data } = await api.get('/api/products', { params })
    setProducts(data)
    setLoading(false)
  }

  useEffect(()=>{ load() // initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const onFilter = (e)=>{
    e.preventDefault()
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Our Juices</h1>
      <form onSubmit={onFilter} className="grid md:grid-cols-4 gap-3 bg-orange-50 p-4 rounded-md mb-6">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search..." className="border rounded px-3 py-2" />
        <select value={size} onChange={(e)=>setSize(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Sizes</option>
          <option>250ml</option>
          <option>500ml</option>
          <option>1L</option>
        </select>
        <select value={type} onChange={(e)=>setType(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Types</option>
          <option>Classic</option>
          <option>Pulpy</option>
          <option>No Sugar</option>
          <option>With Mint</option>
        </select>
        <button className="btn-primary">Apply</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-600">No products found matching your search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p)=> <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}
