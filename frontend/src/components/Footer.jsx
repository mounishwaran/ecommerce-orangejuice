export default function Footer(){
  return (
    <footer className="border-t mt-10 bg-white">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold text-primary">FreshFlow</div>
            <p className="text-sm text-gray-600 mt-2">Freshness in every drop. Pure orange goodness delivered fast.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Shop</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><a href="/products" className="hover:text-primary">All Products</a></li>
              <li><a href="/products" className="hover:text-primary">Classic</a></li>
              <li><a href="/products" className="hover:text-primary">Pulpy</a></li>
              <li><a href="/products" className="hover:text-primary">No Sugar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-primary">About</a></li>
              <li><a href="/contact" className="hover:text-primary">Contact</a></li>
              <li><a href="/orders" className="hover:text-primary">Orders</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Get in touch</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Email: support@freshflow.local</li>
              <li>Hours: 9am – 6pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t pt-4 text-center text-xs text-gray-500">© {new Date().getFullYear()} FreshFlow. All rights reserved.</div>
      </div>
    </footer>
  )
}
