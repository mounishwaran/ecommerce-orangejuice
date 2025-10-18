import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useCart } from '../state/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  return (
    <header className="border-b bg-white sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">FreshFlow</Link>
        <nav className="flex items-center gap-4">
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
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-gray-600">Hi, {user.name.split(' ')[0]}</span>
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
    </header>
  )
}
