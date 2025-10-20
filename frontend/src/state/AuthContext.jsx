import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const AuthCtx = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const json = localStorage.getItem('ff_user')
    return json ? JSON.parse(json) : null
  })

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('ff_token', data.token)
      localStorage.setItem('ff_user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success('Logged in')
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.[0]?.message || 'Login failed'
      toast.error(msg)
      throw e
    }
  }

  const signup = async (payload) => {
    try {
      const { data } = await api.post('/api/auth/register', payload)
      localStorage.setItem('ff_token', data.token)
      localStorage.setItem('ff_user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success('Account created')
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.[0]?.message || 'Sign up failed'
      toast.error(msg)
      throw e
    }
  }

  const logout = () => {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    setUser(null)
    toast.success('Logged out')
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
