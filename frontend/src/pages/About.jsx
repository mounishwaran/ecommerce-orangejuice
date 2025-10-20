import { motion } from 'framer-motion'

export default function About(){
  return (
    <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">About FreshFlow</h1>
        <p className="mt-3 md:mt-4 text-gray-700">We squeeze the freshest oranges sourced from trusted farms and deliver them to your door at top speed. No concentrates, no preservatives—just pure sunshine in a bottle.</p>
        <p className="mt-2 text-gray-700">Our promise is freshness, speed, and flavor. Every drop is crafted to energize your day.</p>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="mt-6 p-4 rounded bg-orange-50">
          <h2 className="font-semibold">Sourcing Story</h2>
          <p className="text-gray-700 text-sm">We partner with small orchards to ensure sustainable practices and peak ripeness at harvest.</p>
        </motion.div>
      </div>
      <motion.div whileInView={{opacity:1}} initial={{opacity:0}} transition={{duration:0.6}} className="min-h-[14rem] sm:min-h-[18rem] md:min-h-[22rem] bg-gradient-to-b from-white to-orange-50 rounded-2xl shadow-lg p-2 flex items-center justify-center"
        onMouseEnter={(e)=>{ const mv = e.currentTarget.querySelector('model-viewer'); if (mv) mv.setAttribute('auto-rotate','') }}
        onMouseLeave={(e)=>{ const mv = e.currentTarget.querySelector('model-viewer'); if (mv) mv.removeAttribute('auto-rotate') }}
      >
        <model-viewer
          src={encodeURI('/models/orange+farm+3d+model.glb')}
          alt="FreshFlow Orange"
          disable-zoom
          interaction-prompt="none"
          class="pointer-events-none"
          auto-rotate-delay="0"
          shadow-intensity="1"
          exposure="1.1"
          environment-image="neutral"
          poster="/assets/loading.svg"
        ></model-viewer>
      </motion.div>
    </div>
  )
}
