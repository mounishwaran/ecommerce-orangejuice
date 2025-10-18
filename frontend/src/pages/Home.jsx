import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home(){
  return (
    <div>
      <section className="bg-orange-50 rounded-xl p-8 grid md:grid-cols-2 items-center gap-8">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Freshly Squeezed Happiness Delivered Fast!</h1>
          <p className="mt-4 text-gray-700">Order fresh orange juices in minutes. Squeezed on demand and delivered lightning fast.</p>
          <div className="mt-6 flex gap-4">
            <Link to="/products" className="btn-primary">Shop Juices</Link>
            <Link to="/orders" className="px-4 py-2 rounded-md border border-primary text-primary">Track Orders</Link>
          </div>
        </motion.div>
        <motion.div whileInView={{opacity:1}} initial={{opacity:0}} transition={{duration:0.6}} className="h-72 md:h-96 bg-white rounded-2xl border shadow-lg overflow-hidden flex items-center justify-center">
          <model-viewer
            src={encodeURI('/models/orange+juice+bottle+3d+model.glb')}
            alt="FreshFlow Orange"
            auto-rotate
            camera-controls
            shadow-intensity="1"
            exposure="1.1"
            environment-image="neutral"
            poster="/assets/loading.svg"
            style={{ width: '100%', height: '100%', borderRadius: '16px' }}
          ></model-viewer>
        </motion.div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Why FreshFlow?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {title:'Ultra Fresh',desc:'Picked and squeezed the same day.'},
            {title:'Lightning Fast',desc:'Delivered in under 30 minutes in service areas.'},
            {title:'100% Natural',desc:'No concentrates, no preservatives.'},
          ].map((f)=> (
            <motion.div whileHover={{ y: -4 }} key={f.title} className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
