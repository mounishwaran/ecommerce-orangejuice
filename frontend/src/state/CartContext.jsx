import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

const CartCtx = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const json = localStorage.getItem('ff_cart')
    return json ? JSON.parse(json) : []
  })

  useEffect(() => {
    localStorage.setItem('ff_cart', JSON.stringify(items))
  }, [items])

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p._id === product._id)
      if (existing) {
        return prev.map((p) => (p._id === product._id ? { ...p, quantity: p.quantity + qty } : p))
      }
      return [...prev, { ...product, quantity: qty }]
    })
    toast.success('Added to cart')
  }

  const updateQty = (id, qty) => {
    setItems((prev) => prev.map((p) => (p._id === id ? { ...p, quantity: qty } : p)))
  }

  const remove = (id) => setItems((prev) => prev.filter((p) => p._id !== id))
  const clear = () => setItems([])

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)

  const value = useMemo(() => ({ items, add, updateQty, remove, clear, total }), [items, total])
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export const useCart = () => useContext(CartCtx)
