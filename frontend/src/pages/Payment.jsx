import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function Payment(){
  const { items, total, clear } = useCart()
  const [form, setForm] = useState({ card:'', name:'', expiry:'', cvv:'' })
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    if (!items.length) navigate('/cart')
  },[items.length, navigate])

  const validate = () => {
    const card = form.card.replace(/\s+/g,'')
    if (card.length < 12) return 'Invalid card number'
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(form.expiry)) return 'Expiry must be MM/YY'
    if (!/^[0-9]{3,4}$/.test(form.cvv)) return 'Invalid CVV'
    if (!form.name.trim()) return 'Name required'
    return null
  }

  const pay = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return toast.error(err)
    setProcessing(true)
    // Simulate processing
    setTimeout(async () => {
      try {
        const payload = {
          items: items.map(i => ({ productId: i._id, quantity: i.quantity })),
          totalAmount: Number(total.toFixed(2))
        }
        await api.post('/api/orders', payload) // backend creates as Pending
        setDone(true)
        clear()
        setTimeout(()=> navigate('/orders'), 1200)
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Payment failed')
      } finally {
        setProcessing(false)
      }
    }, 1300)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Payment</h1>
      <p className="text-sm text-gray-600 mb-4">Total to pay: <span className="font-semibold">${total.toFixed(2)}</span></p>
      <form onSubmit={pay} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name on Card" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Card Number" value={form.card} onChange={e=>setForm({...form, card:e.target.value})} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="MM/YY" value={form.expiry} onChange={e=>setForm({...form, expiry:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="CVV" value={form.cvv} onChange={e=>setForm({...form, cvv:e.target.value})} required />
        </div>
        <button disabled={processing} className="btn-primary w-full">{processing? 'Processing...' : 'Pay Now'}</button>
      </form>

      <AnimatePresence>
        {processing && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="mt-4 text-center text-sm text-gray-600">
            Processing payment...
          </motion.div>
        )}
        {done && (
          <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} exit={{opacity:0}} className="mt-4 text-center text-green-600 font-semibold">
            Payment successful! Creating order...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
