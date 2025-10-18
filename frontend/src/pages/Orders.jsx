import { useEffect, useState } from 'react'
import api from '../lib/api'
import OrderStatusTracker from '../components/OrderStatusTracker'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { data } = await api.get('/api/orders')
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    load()
    const id = setInterval(load, 5000) // polling for real-time updates
    return ()=>clearInterval(id)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {loading ? 'Loading...' : (
        <div className="space-y-4">
          {orders.length === 0 && <div>No orders yet.</div>}
          {orders.map(o => (
            <div key={o._id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Order #{o._id.slice(-6)}</div>
                  <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm">Total: <span className="font-bold">${o.totalAmount.toFixed(2)}</span></div>
              </div>
              <div className="mt-3">
                <OrderStatusTracker status={o.status} />
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {o.items.length} item(s)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
