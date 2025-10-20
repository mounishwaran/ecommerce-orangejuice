import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'

export default function Home(){
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async()=>{
      try {
        const { data } = await api.get('/api/products')
        setFeatured(data.slice(0,4))
      } finally {
        setLoading(false)
      }
    })()
  },[])
  return (
    <div>
      <section className="bg-orange-50 rounded-xl p-4 sm:p-6 md:p-8 grid md:grid-cols-2 items-center gap-6 md:gap-8">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary leading-tight">Freshly Squeezed Happiness Delivered Fast!</h1>
          <p className="mt-3 md:mt-4 text-gray-700">Order fresh orange juices in minutes. Squeezed on demand and delivered lightning fast.</p>
          <div className="mt-6 flex gap-4">
            <Link to="/products" className="btn-primary">Shop Juices</Link>
            <Link to="/orders" className="px-4 py-2 rounded-md border border-primary text-primary">Track Orders</Link>
          </div>
        </motion.div>
        <motion.div whileInView={{opacity:1}} initial={{opacity:0}} transition={{duration:0.6}} className="tilt-on-hover group min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] bg-white rounded-2xl border shadow-lg overflow-hidden flex items-center justify-center transition-transform duration-300"
          onMouseEnter={(e)=>{ const mv = e.currentTarget.querySelector('model-viewer'); if (mv) mv.setAttribute('auto-rotate','') }}
          onMouseLeave={(e)=>{ const mv = e.currentTarget.querySelector('model-viewer'); if (mv) mv.removeAttribute('auto-rotate') }}
        >
          <model-viewer
            src={encodeURI('/models/orange+juice+bottle+3d+model.glb')}
            alt="FreshFlow Orange"
            disable-zoom
            interaction-prompt="none"
            class="tilt-item pointer-events-none"
            auto-rotate-delay="0"
            shadow-intensity="1"
            exposure="1.1"
            environment-image="neutral"
            poster="/assets/loading.svg"
          ></model-viewer>
        </motion.div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why FreshFlow?</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {title:'Ultra Fresh',desc:'Picked and squeezed the same day.', img:'/models/classic-juice.jpg'},
            {title:'Lightning Fast',desc:'Delivered in under 30 minutes in service areas.', img:'/models/pulpy-juice.jpg'},
            {title:'100% Natural',desc:'No concentrates, no preservatives.', img:'/models/no-sugar.jpg'},
          ].map((f)=> (
            <motion.div whileHover={{ y: -4 }} key={f.title} className="p-4 sm:p-6 border rounded-lg bg-white">
              <img src={f.img} alt={f.title} className="w-full h-36 sm:h-40 md:h-44 object-cover rounded mb-3" />
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 border rounded-xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-primary">Limited Time Offers!</h3>
            <p className="text-gray-700">Claim exciting discounts and special promotions on your favorite juices.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/about" className="px-4 py-2 rounded-md border border-primary text-primary">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary">View all</Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">What our customers say</h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            {name:'Aarav', text:'Best orange juice I have ever had. Super fresh!', img:'/models/orange-mint.jpg'},
            {name:'Diya', text:'Delivery was so quick and the taste is amazing.', img:'/models/classic-juice.jpg'},
            {name:'Kabir', text:'Healthy and delicious. My daily boost!', img:'/models/no-sugar.jpg'},
          ].map(t => (
            <div key={t.name} className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <img src={t.img} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{t.name}</div>
                <p className="text-sm text-gray-600">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">Want to leave feedback? <Link to="/contact" className="text-primary">Contact us</Link>.</p>
      </section>
    </div>
  )
}
