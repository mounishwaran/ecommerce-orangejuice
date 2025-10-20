import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
})

// Attach JWT automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ff_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  config.headers['Content-Type'] = 'application/json'
  return config
})

export default api
