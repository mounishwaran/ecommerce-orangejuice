import { useState } from 'react'
import { useAuth } from '../state/AuthContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', form: '' })
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    // client-side validation
    const next = { email: '', password: '', form: '' }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email.'
    if (!password) next.password = 'This field is required.'
    setErrors(next)
    if (next.email || next.password) return

    setLoading(true)
    try {
      await login(email, password)
      const to = location.state?.from?.pathname || '/'
      navigate(to, { replace: true })
    } catch (e) {
      setErrors((prev)=>({ ...prev, form: 'Invalid email or password.' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md lg:max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <input type="email" className="w-full border rounded px-4 py-3 text-base lg:px-5 lg:py-3.5 lg:text-lg" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <input type="password" className="w-full border rounded px-4 py-3 text-base lg:px-5 lg:py-3.5 lg:text-lg" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>
        {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="text-primary" to="/signup">Sign up</Link></p>
    </div>
  )
}
