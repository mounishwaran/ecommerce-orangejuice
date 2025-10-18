import { useState } from 'react'
import { useAuth } from '../state/AuthContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      const to = location.state?.from?.pathname || '/'
      navigate(to, { replace: true })
    } catch (e) {
      // handled by context toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button disabled={loading} className="btn-primary w-full">{loading? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="text-primary" to="/signup">Sign up</Link></p>
    </div>
  )
}
