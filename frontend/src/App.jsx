import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Payment from './pages/Payment.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
