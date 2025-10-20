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
    const nameOk = /^[A-Za-z ]{3,}$/.test((form.name||'').trim())
    if (!nameOk) next.name = 'Name must be at least 3 letters (alphabets and spaces only).'
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email||'')
    if (!emailOk) next.email = 'Please enter a valid email.'
    const pwd = form.password||''
    const strong = pwd.length>=8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)
    if (!strong) next.password = 'Password must have upper, lower, number, special char and 8+ length.'
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

  const onChangeField = (key, value) => {
    setForm(prev=>({ ...prev, [key]: value }))
    if (key === 'name') {
      const ok = /^[A-Za-z ]{3,}$/.test((value||'').trim())
      setErrors(prev=>({ ...prev, name: ok? '' : 'Name must be at least 3 letters (alphabets and spaces only).' }))
    }
    if (key === 'email') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value||'')
      setErrors(prev=>({ ...prev, email: ok? '' : 'Please enter a valid email.' }))
    }
    if (key === 'password') {
      const pwd = value||''
      const strong = pwd.length>=8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)
      setErrors(prev=>({ ...prev, password: strong? '' : 'Password must have upper, lower, number, special char and 8+ length.' }))
    }
  }
  }

  return (
    <div className="max-w-md lg:max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <input className="w-full border rounded px-4 py-3 text-base lg:px-5 lg:py-3.5 lg:text-lg" placeholder="Name" value={form.name} onChange={(e)=>onChangeField('name', e.target.value)} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input type="email" className="w-full border rounded px-4 py-3 text-base lg:px-5 lg:py-3.5 lg:text-lg" placeholder="Email" value={form.email} onChange={(e)=>onChangeField('email', e.target.value)} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <input type="password" className="w-full border rounded px-4 py-3 text-base lg:px-5 lg:py-3.5 lg:text-lg" placeholder="Password" value={form.password} onChange={(e)=>onChangeField('password', e.target.value)} />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>
        <div>
          <input className="w-full border rounded px-4 py-3 text-base lg:px-5 lg:py-3.5 lg:text-lg" placeholder="Address (optional)" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading? 'Creating...' : 'Sign Up'}</button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link className="text-primary" to="/login">Login</Link></p>
    </div>
  )
}
