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
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('ff_token', data.token)
    localStorage.setItem('ff_user', JSON.stringify(data.user))
    setUser(data.user)
    toast.success('Logged in')
  }

  const signup = async (payload) => {
    const { data } = await api.post('/api/auth/signup', payload)
    localStorage.setItem('ff_token', data.token)
    localStorage.setItem('ff_user', JSON.stringify(data.user))
    setUser(data.user)
    toast.success('Account created')
  }

  const logout = () => {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
