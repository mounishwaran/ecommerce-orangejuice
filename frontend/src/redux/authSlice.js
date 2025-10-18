import { createSlice } from '@reduxjs/toolkit'

const initialUser = (() => {
  try { return JSON.parse(localStorage.getItem('ff_user')) || null } catch { return null }
})()
const initialToken = localStorage.getItem('ff_token') || null

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: initialUser, token: initialToken },
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      localStorage.setItem('ff_user', JSON.stringify(user))
      localStorage.setItem('ff_token', token)
    },
    clearCredentials(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('ff_user')
      localStorage.removeItem('ff_token')
    }
  }
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
