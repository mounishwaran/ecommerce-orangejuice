import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useCart } from '../state/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-white sticky top-0 z-20">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">FreshFlow</Link>
          <button aria-label="Toggle navigation" aria-expanded={open} onClick={()=>setOpen(!open)} className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-primary/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={({isActive})=> isActive? 'text-primary font-semibold' : 'text-gray-700'}>Home</NavLink>
            <NavLink to="/products" className={({isActive})=> isActive? 'text-primary font-semibold' : 'text-gray-700'}>Products</NavLink>
            <NavLink to="/about" className={({isActive})=> isActive? 'text-primary font-semibold' : 'text-gray-700'}>About</NavLink>
            <NavLink to="/contact" className={({isActive})=> isActive? 'text-primary font-semibold' : 'text-gray-700'}>Contact</NavLink>
            {user?.role !== 'admin' && (
              <>
                <NavLink to="/orders" className={({isActive})=> isActive? 'text-primary font-semibold' : 'text-gray-700'}>Orders</NavLink>
                <NavLink to="/cart" className={({isActive})=> isActive? 'text-primary font-semibold' : 'text-gray-700'}>
                  Cart ({items.reduce((s,i)=>s+i.quantity,0)})
                </NavLink>
              </>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({isActive})=> isActive? 'text-primary font-semibold' : 'text-gray-700'}>Admin</NavLink>
            )}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden lg:block text-gray-600">Hi, {user.name.split(' ')[0]}</span>
                <button className="btn-primary" onClick={()=>{ logout(); navigate('/'); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile panel */}
        {open && (
          <div className="md:hidden mt-3 border-t pt-3 space-y-3">
            <div className="flex flex-col gap-2">
              <NavLink onClick={()=>setOpen(false)} to="/" className={({isActive})=> (isActive? 'text-primary font-semibold' : 'text-gray-700') + ' py-1'}>Home</NavLink>
              <NavLink onClick={()=>setOpen(false)} to="/products" className={({isActive})=> (isActive? 'text-primary font-semibold' : 'text-gray-700') + ' py-1'}>Products</NavLink>
              <NavLink onClick={()=>setOpen(false)} to="/about" className={({isActive})=> (isActive? 'text-primary font-semibold' : 'text-gray-700') + ' py-1'}>About</NavLink>
              <NavLink onClick={()=>setOpen(false)} to="/contact" className={({isActive})=> (isActive? 'text-primary font-semibold' : 'text-gray-700') + ' py-1'}>Contact</NavLink>
              {user?.role !== 'admin' && (
                <>
                  <NavLink onClick={()=>setOpen(false)} to="/orders" className={({isActive})=> (isActive? 'text-primary font-semibold' : 'text-gray-700') + ' py-1'}>Orders</NavLink>
                  <NavLink onClick={()=>setOpen(false)} to="/cart" className={({isActive})=> (isActive? 'text-primary font-semibold' : 'text-gray-700') + ' py-1'}>
                    Cart ({items.reduce((s,i)=>s+i.quantity,0)})
                  </NavLink>
                </>
              )}
              {user?.role === 'admin' && (
                <NavLink onClick={()=>setOpen(false)} to="/admin" className={({isActive})=> (isActive? 'text-primary font-semibold' : 'text-gray-700') + ' py-1'}>Admin</NavLink>
              )}
            </div>
            <div className="flex items-center gap-3 pt-2">
              {user ? (
                <button className="btn-primary w-full" onClick={()=>{ setOpen(false); logout(); navigate('/'); }}>Logout</button>
              ) : (
                <div className="flex gap-3 w-full">
                  <Link onClick={()=>setOpen(false)} to="/login" className="flex-1 text-center border rounded py-2">Login</Link>
                  <Link onClick={()=>setOpen(false)} to="/signup" className="flex-1 btn-primary text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
