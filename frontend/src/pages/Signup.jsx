import { useState } from 'react'
import { useAuth } from '../state/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup(){
  const { signup } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', password:'', address:'' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(form)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
        <button disabled={loading} className="btn-primary w-full">{loading? 'Creating...' : 'Sign Up'}</button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link className="text-primary" to="/login">Login</Link></p>
    </div>
  )
}
