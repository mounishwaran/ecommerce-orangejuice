import { useState } from 'react'
import { useCart } from '../state/CartContext'
import { useAuth } from '../state/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', address: user?.address || '', phone: '' , payment: 'COD'})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ name:'', address:'', phone:'' })

  const submit = (e) => {
    e.preventDefault()
    if (!items.length) return toast.error('Cart is empty')
    const next = { name:'', address:'', phone:'' }
    if (!form.name) next.name = 'This field is required.'
    if (!form.address) next.address = 'This field is required.'
    if (!form.phone) next.phone = 'This field is required.'
    setErrors(next)
    if (next.name || next.address || next.phone) return
    setLoading(true)
    // In a full app you'd persist address; here we proceed to payment
    setTimeout(()=>{
      setLoading(false)
      navigate('/payment', { state: { payment: form.payment } })
    }, 300)
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <form onSubmit={submit} className="md:col-span-2 space-y-3">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div>
          <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input className="w-full border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
          {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
        </div>
        <div>
          <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
        </div>
        <select className="w-full border rounded px-3 py-2" value={form.payment} onChange={(e)=>setForm({...form, payment:e.target.value})}>
          <option value="COD">Cash on Delivery</option>
          <option value="Card">Card</option>
        </select>
        <button disabled={loading} className="btn-primary">{loading ? 'Placing...' : 'Place Order'}</button>
      </form>
      <div className="border rounded p-4 h-fit">
        <h2 className="text-xl font-bold mb-2">Order Summary</h2>
        <div className="space-y-2 max-h-64 overflow-auto pr-2">
          {items.map(it => (
            <div key={it._id} className="flex items-center justify-between text-sm">
              <span>{it.name} × {it.quantity}</span>
              <span>${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t mt-3 pt-3">
          <span>Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
