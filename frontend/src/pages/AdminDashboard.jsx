import { useEffect, useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function AdminDashboard(){
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name:'', price:'', description:'', imageURL:'', modelURL:'', size:'500ml', type:'Classic', active:true })
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [{ data: prod }, { data: ord }, { data: msgs } ] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/orders/all'),
        api.get('/api/contact')
      ])
      setProducts(prod)
      setOrders(ord)
      setContacts(msgs)
    } catch (e) {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  const saveProduct = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, { ...form, price: Number(form.price) })
        toast.success('Product updated')
      } else {
        await api.post('/api/products', { ...form, price: Number(form.price) })
        toast.success('Product created')
      }
      setForm({ name:'', price:'', description:'', imageURL:'', modelURL:'', size:'500ml', type:'Classic', active:true })
      setEditingId(null)
      load()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save product')
    }
  }

  const edit = (p) => {
    setEditingId(p._id)
    setForm({ name:p.name, price:String(p.price), description:p.description || '', imageURL:p.imageURL || '', modelURL:p.modelURL || '', size:p.size, type:p.type, active: !!p.active })
  }

  const del = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/api/products/${id}`)
    toast.success('Deleted')
    load()
  }

  const updateStatus = async (id, status) => {
    await api.put(`/api/orders/${id}`, { status })
    toast.success('Status updated')
    load()
  }

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return
    await api.delete(`/api/orders/${id}`)
    toast.success('Order deleted')
    load()
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-3">Add / Edit Product</h2>
        <form onSubmit={saveProduct} className="grid md:grid-cols-6 gap-3 bg-orange-50 p-4 rounded">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input type="number" min="0" step="0.01" className="border rounded px-3 py-2" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
          <select className="border rounded px-3 py-2" value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>
            <option>250ml</option>
            <option>500ml</option>
            <option>1L</option>
          </select>
          <select className="border rounded px-3 py-2" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option>Classic</option>
            <option>Pulpy</option>
            <option>No Sugar</option>
            <option>With Mint</option>
          </select>
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Image URL" value={form.imageURL} onChange={e=>setForm({...form,imageURL:e.target.value})} />
          <label className="md:col-span-6 text-sm text-gray-600 flex items-center gap-3">
            <span>Or upload image:</span>
            <input type="file" accept="image/*" onChange={async (e)=>{
              const file = e.target.files?.[0]
              if (!file) return
              const fd = new FormData()
              fd.append('image', file)
              try {
                const { data } = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                setForm((f)=>({ ...f, imageURL: data.url }))
                toast.success('Image uploaded')
              } catch (err) {
                toast.error('Upload failed')
              }
            }} />
          </label>
          <input className="border rounded px-3 py-2 md:col-span-3" placeholder="3D Model URL (.glb/.gltf)" value={form.modelURL} onChange={e=>setForm({...form,modelURL:e.target.value})} />
          <label className="md:col-span-3 text-sm text-gray-600 flex items-center gap-3">
            <span>Or upload model:</span>
            <input type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" onChange={async (e)=>{
              const file = e.target.files?.[0]
              if (!file) return
              const fd = new FormData()
              fd.append('image', file) // reuse endpoint, returns URL
              try {
                const { data } = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                setForm((f)=>({ ...f, modelURL: data.url }))
                toast.success('Model uploaded')
              } catch (err) {
                toast.error('Upload failed')
              }
            }} />
          </label>
          <input className="border rounded px-3 py-2 md:col-span-6" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <div className="md:col-span-6 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} /> Active</label>
            <button className="btn-primary">{editingId ? 'Update' : 'Create'} Product</button>
            {editingId && <button type="button" className="px-4 py-2 border rounded" onClick={()=>{setEditingId(null); setForm({ name:'', price:'', description:'', imageURL:'', modelURL:'', size:'500ml', type:'Classic', active:true })}}>Cancel</button>}
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Products</h2>
        {loading ? 'Loading...' : (
          <div className="grid md:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p._id} className="border rounded p-3">
                <div className="flex items-center gap-3">
                  <img src={p.imageURL || 'https://images.unsplash.com/photo-1571079579697-193f0e2a9a8e?w=200&q=80&auto=format&fit=crop'} alt={p.name} className="h-16 w-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">${p.price.toFixed(2)} · {p.size} · {p.type}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 border rounded" onClick={()=>edit(p)}>Edit</button>
                  <button className="px-3 py-1 border rounded text-red-600" onClick={()=>del(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Orders</h2>
        {loading ? 'Loading...' : (
          <div className="space-y-3">
            {orders.map(o => {
              const pay = o.payment || {}
              const contact = o.contact || {}
              const masked = pay.method === 'Card' ? `${pay.cardBrand || 'CARD'} •••• ${pay.cardLast4 || '____'}` : pay.method || 'COD'
              const customerName = contact.name || o.userId?.name || o.userName || '—'
              const customerEmail = contact.email || o.userId?.email || o.userEmail || '—'
              const customerPhone = contact.phone || o.userId?.phone || o.userPhone || '—'
              const customerAddress = contact.address || o.userId?.address || o.userAddress || '—'
              const productNameById = new Map(products.map(p=>[String(p._id), p.name]))
              return (
                <div key={o._id} className="border rounded p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-semibold">Order #{o._id.slice(-6)}</div>
                      <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()} · ${o.totalAmount.toFixed(2)} · <span className="font-medium">{o.status}</span></div>
                      <div className="text-sm">
                        <div><span className="text-gray-600">Customer:</span> {customerName}</div>
                        <div><span className="text-gray-600">Phone:</span> {customerPhone} · <span className="text-gray-600">Email:</span> {customerEmail}</div>
                        <div className="text-gray-600">Address:</div>
                        <div className="whitespace-pre-wrap break-words">{customerAddress}</div>
                        <div className="mt-1"><span className="text-gray-600">Payment:</span> {masked}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="border rounded px-2 py-1" value={o.status} onChange={(e)=>updateStatus(o._id, e.target.value)}>
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Preparing</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                      </select>
                      <button className="px-3 py-1 border rounded text-red-600" onClick={()=>deleteOrder(o._id)}>Delete</button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <div className="font-medium mb-1">Items</div>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-1">
                      {(o.items||[]).map((it, idx) => {
                        const id = typeof it.productId === 'object' && it.productId?._id ? String(it.productId._id) : String(it.productId)
                        const name = it.itemName || it.productId?.name || productNameById.get(id) || id
                        return (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="truncate pr-3">{name} × {it.quantity}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Customer Messages</h2>
        {loading ? 'Loading...' : (
          contacts.length === 0 ? (
            <div className="text-sm text-gray-600">No messages yet.</div>
          ) : (
            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c._id} className="border rounded p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold break-words">{c.name} <span className="text-gray-500 font-normal">({c.email})</span></div>
                    <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap break-words">{c.message}</p>
                </div>
              ))}
            </div>
          )
        )}
      </section>
    </div>
  )
}
