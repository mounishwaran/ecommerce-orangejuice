import { motion } from 'framer-motion'

export default function About(){
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-3xl font-extrabold text-primary">About FreshFlow</h1>
        <p className="mt-4 text-gray-700">We squeeze the freshest oranges sourced from trusted farms and deliver them to your door at top speed. No concentrates, no preservatives—just pure sunshine in a bottle.</p>
        <p className="mt-2 text-gray-700">Our promise is freshness, speed, and flavor. Every drop is crafted to energize your day.</p>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="mt-6 p-4 rounded bg-orange-50">
          <h2 className="font-semibold">Sourcing Story</h2>
          <p className="text-gray-700 text-sm">We partner with small orchards to ensure sustainable practices and peak ripeness at harvest.</p>
        </motion.div>
      </div>
      <motion.div whileInView={{opacity:1}} initial={{opacity:0}} transition={{duration:0.6}} className="h-96 bg-gradient-to-b from-white to-orange-50 rounded-2xl shadow-lg p-2 flex items-center justify-center">
        <model-viewer
          src={encodeURI('/models/orange+farm+3d+model.glb')}
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
    </div>
  )
}
