import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function Payment(){
  const { items, total, clear } = useCart()
  const [form, setForm] = useState({ card:'', name:'', expiry:'', cvv:'' })
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isCOD = (location.state?.payment || 'COD') === 'COD'
  const [ordersCount, setOrdersCount] = useState(0)
  const [code, setCode] = useState('')
  const [couponStatus, setCouponStatus] = useState('idle') // idle | checking | valid | invalid
  const [couponPercent, setCouponPercent] = useState(0)
  const baseTotal = Number(total.toFixed(2))
  const finalTotal = +(baseTotal * (1 - (couponStatus === 'valid' ? couponPercent : 0)/100)).toFixed(2)
  const contact = location.state?.contact || {}

  useEffect(()=>{
    if (!items.length) navigate('/cart')
  },[items.length, navigate])

  useEffect(()=>{
    (async()=>{
      try {
        const { data } = await api.get('/api/orders')
        setOrdersCount(Array.isArray(data) ? data.length : 0)
      } catch (err) {
        console.error('Orders fetch failed', err)
        setOrdersCount(0)
      }
    })()
  },[])

  const checkCoupon = async () => {
    const trimmed = (code || '').trim()
    if (!trimmed) return toast.error('Enter a coupon code')
    try {
      setCouponStatus('checking')
      const payload = {
        code: trimmed,
        items: items.map(i=>({ productId: i._id, quantity: i.quantity })),
        subtotal: baseTotal
      }
      const { data } = await api.post('/api/coupons/validate', payload)
      if (data?.valid) {
        setCouponPercent(Number(data.percent) || 0)
        setCouponStatus('valid')
        toast.success('Coupon applied successfully! ' + (data.percent||0) + '% off added.')
      } else {
        setCouponPercent(0)
        setCouponStatus('invalid')
        toast.error('Invalid or expired coupon code.')
      }
    } catch (err) {
      // Only surface auth issues; keep other technical errors in console as requested
      if (err?.response?.status === 401) {
        toast.error('Please login to validate coupons')
      } else {
        console.error('Coupon validation failed', err)
      }
      setCouponStatus('idle')
    }
  }

  const validate = () => {
    if (isCOD) return null // No card validation for Cash on Delivery
    const card = form.card.replace(/\s+/g,'')
    if (!/^\d{16}$/.test(card)) return 'Card number must be 16 digits'
    // Luhn check
    const luhn = (num)=>{
      let sum=0, dbl=false
      for (let i=num.length-1;i>=0;i--) {
        let d = parseInt(num[i],10)
        if (dbl) { d*=2; if (d>9) d-=9 }
        sum += d; dbl = !dbl
      }
      return sum % 10 === 0
    }
    if (!luhn(card)) return 'Invalid card number'
    // Expiry MM/YY future and within 10 years
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return 'Expiry must be MM/YY'
    const [mmStr, yyStr] = form.expiry.split('/')
    const mm = parseInt(mmStr,10), yy = parseInt(yyStr,10)
    if (mm<1 || mm>12) return 'Invalid expiry month'
    const now = new Date()
    const currentYY = now.getFullYear()%100
    const currentMM = now.getMonth()+1
    const within10 = yy <= ((currentYY+10)%100) || (currentYY+10>=100) // simple bound
    const future = (yy>currentYY) || (yy===currentYY && mm>=currentMM)
    if (!future) return 'Card is expired'
    if (!within10) return 'Expiry too far in future'
    // CVV 3 digits
    if (!/^\d{3}$/.test(form.cvv)) return 'Invalid CVV'
    if (!form.name.trim()) return 'Name required'
    return null
  }

  const pay = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return toast.error(err)
    setProcessing(true)
    // For COD, we skip any payment processing delays
    setTimeout(async () => {
      try {
        const payload = {
          items: items.map(i => ({ productId: i._id, quantity: i.quantity })),
          totalAmount: finalTotal,
          contact: {
            name: contact?.name || '',
            address: contact?.address || '',
            phone: contact?.phone || '',
            email: contact?.email || ''
          },
          payment: {
            method: isCOD ? 'COD' : 'Card',
            cardNumber: isCOD ? undefined : form.card.replace(/\s+/g,'')
          }
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
    }, isCOD ? 300 : 1300)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Payment</h1>
      <div className="text-sm text-gray-600 mb-4 space-y-1">
        <div>Subtotal: <span className="font-semibold">${total.toFixed(2)}</span></div>
        <div className="flex items-center gap-2 flex-wrap">
          <span>Discount code:</span>
          <input className="border rounded px-2 py-1" placeholder="Enter code" value={code} onChange={e=>{ setCode(e.target.value); setCouponStatus('idle'); setCouponPercent(0); }} />
          <button type="button" onClick={checkCoupon} className="px-3 py-1 border rounded text-primary border-primary disabled:opacity-50" disabled={couponStatus==='checking'}>
            {couponStatus==='checking' ? 'Checking...' : 'Check Eligibility'}
          </button>
        </div>
        {couponStatus==='valid' && <div className="text-green-600">Eligible: {couponPercent}% off applied</div>}
        {couponStatus==='invalid' && <div className="text-red-600">Not eligible for this coupon</div>}
        <div className="font-semibold">Total to pay: ${finalTotal.toFixed(2)}</div>
      </div>
      <form onSubmit={pay} className="space-y-3">
        {!isCOD && (
          <>
            <input className="w-full border rounded px-3 py-2" placeholder="Name on Card" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            <input className="w-full border rounded px-3 py-2" placeholder="Card Number" value={form.card} onChange={e=>setForm({...form, card:e.target.value})} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" placeholder="MM/YY" value={form.expiry} onChange={e=>setForm({...form, expiry:e.target.value})} required />
              <input className="border rounded px-3 py-2" placeholder="CVV" value={form.cvv} onChange={e=>setForm({...form, cvv:e.target.value})} required />
            </div>
          </>
        )}
        <button disabled={processing || ((code||'').trim() && couponStatus!=='valid')} className="btn-primary w-full">{processing? (isCOD? 'Placing...' : 'Processing...') : (isCOD? 'Place Order' : 'Pay Now')}</button>
      </form>

      <div className="mt-6 p-4 border rounded bg-orange-50">
        <h3 className="font-semibold mb-2">Offers & Discounts</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li><span className="font-medium">FRESH20</span>: 20% off for first-time users.</li>
          <li><span className="font-medium">BULK10</span>: 10% off on bulk orders (10+ items).</li>
          <li><span className="font-medium">LOYAL5</span>: 5% off if you have 5+ past orders.</li>
          <li><span className="font-medium">LOYAL10</span>: 10% off if you have 10+ past orders.</li>
          <li><span className="font-medium">REGULAR5</span>: 5% off if you have 3+ past orders.</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">Eligibility updates automatically based on your order history and cart.</p>
      </div>

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
