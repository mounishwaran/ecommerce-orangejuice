import { useState } from 'react'
import { useAuth } from '../state/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup(){
  const { signup } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', password:'', address:'' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ name:'', email:'', password:'', address:'', form:'' })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const next = { name:'', email:'', password:'', address:'', form:'' }
    if (!form.name) next.name = 'This field is required.'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email.'
    if (!form.password || form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    if (next.name || next.email || next.password) return

    setLoading(true)
    try {
      await signup(form)
      navigate('/')
    } catch {
      // toast shown in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>
        <div>
          <input className="w-full border rounded px-3 py-2" placeholder="Address (optional)" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading? 'Creating...' : 'Sign Up'}</button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link className="text-primary" to="/login">Login</Link></p>
    </div>
  )
}
