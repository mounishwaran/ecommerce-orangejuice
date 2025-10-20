import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../state/CartContext'

export default function Cart(){
  const { items, updateQty, remove, total } = useCart()
  const navigate = useNavigate()

  if (!items.length) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      <div className="md:col-span-2 space-y-4">
        {items.map((it)=> (
          <div key={it._id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border rounded p-3">
            <img src={it.imageURL || 'https://images.unsplash.com/photo-1571079579697-193f0e2a9a8e?w=300&q=80&auto=format&fit=crop'} alt={it.name} className="w-full h-32 object-cover rounded sm:w-20 sm:h-20" />
            <div className="flex-1">
              <div className="font-semibold break-words">{it.name}</div>
              <div className="text-sm text-gray-600">${it.price.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input type="number" min={1} value={it.quantity} onChange={(e)=>updateQty(it._id, Number(e.target.value)||1)} className="w-full sm:w-20 border rounded px-2 py-1" />
              <button className="text-red-600" onClick={()=>remove(it._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border rounded p-4 h-fit">
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <div className="flex items-center justify-between mb-4">
          <span>Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        <button className="btn-primary w-full" onClick={()=>navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  )
}
