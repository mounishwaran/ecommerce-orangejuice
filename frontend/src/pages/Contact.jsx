import { useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/contact', form)
      toast.success('Message sent!')
      setForm({ name:'', email:'', message:'' })
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
        <textarea className="w-full border rounded px-3 py-2 h-32" placeholder="Message" value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} required />
        <button disabled={loading} className="btn-primary">{loading? 'Sending...' : 'Send'}</button>
      </form>
    </div>
  )
}
