import { motion } from 'framer-motion'
import { useCart } from '../state/CartContext'
import api from '../lib/api'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function ProductCard({ product }){
  const { add } = useCart()
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  const src = (() => {
    if (!product.imageURL) return 'https://images.unsplash.com/photo-1571079579697-193f0e2a9a8e?w=600&q=80&auto=format&fit=crop'
    const url = product.imageURL
    if (url.startsWith('http')) return url
    if (url.startsWith('/uploads')) return `${base}${url}` // backend-served uploads
    if (url.startsWith('/models')) return url // frontend public models folder
    if (url.startsWith('models')) return `/${url}` // bare -> root-relative
    if (url.startsWith('/')) return url // other root-relative assets in public
    // default: treat as frontend public root-relative
    return `/${url}`
  })()
  const modelSrc = useMemo(()=>{
    if (!product.modelURL) return null
    const url = product.modelURL
    if (url.startsWith('http')) return url
    if (url.startsWith('/uploads')) return `${base}${url}` // served from backend
    if (url.startsWith('/')) return url // served by frontend public (e.g., /models/...)
    return `/${url}` // bare relative path -> treat as frontend public root
  }, [product.modelURL, base])
  const [loading, setLoading] = useState(!!modelSrc)
  const [failed, setFailed] = useState(false)
  const mvRef = useRef(null)

  useEffect(()=>{
    if (!modelSrc) return
    const el = mvRef.current
    if (!el) return
    const handleLoad = () => { setLoading(false) }
    const handleError = () => { setLoading(false); setFailed(true) }
    el.addEventListener('load', handleLoad)
    el.addEventListener('error', handleError)
    // safety timeout in case events don’t fire
    const t = setTimeout(()=> setLoading(false), 5000)
    return ()=>{
      el.removeEventListener('load', handleLoad)
      el.removeEventListener('error', handleError)
      clearTimeout(t)
    }
  }, [modelSrc])
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} initial={{opacity:0, y:6}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} className="border rounded-lg p-4 flex flex-col">
      {modelSrc && !failed ? (
        <div className="w-full h-56 rounded overflow-hidden bg-white flex items-center justify-center relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <img src="/assets/loading.svg" alt="loading" className="h-10 w-10" />
            </div>
          )}
          <model-viewer
            ref={mvRef}
            src={modelSrc ? encodeURI(modelSrc) : undefined}
            alt={product.name}
            auto-rotate
            camera-controls
            shadow-intensity="1"
            exposure="1.1"
            environment-image="neutral"
            poster="/assets/loading.svg"
            style={{ width: '100%', height: '100%', borderRadius: '12px' }}
          ></model-viewer>
        </div>
      ) : (
        <img src={src} alt={product.name} className="h-56 w-full object-cover rounded" />
      )}
      <h3 className="mt-3 font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 flex-1">{product.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="font-bold">${product.price.toFixed(2)}</span>
        <button className="btn-primary" onClick={()=>add(product,1)}>Add to Cart</button>
      </div>
    </motion.div>
  )
}
