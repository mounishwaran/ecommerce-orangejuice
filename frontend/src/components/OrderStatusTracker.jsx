const steps = ['Pending','Confirmed','Preparing','Out for Delivery','Delivered']

export default function OrderStatusTracker({ status }){
  const activeIndex = steps.indexOf(status)
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, idx) => (
        <div key={s} className="flex items-center">
          <div className={`h-2 w-8 rounded ${idx <= activeIndex ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <span className={`ml-2 text-xs ${idx <= activeIndex ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
          {idx < steps.length - 1 && <span className="mx-2 text-gray-300">›</span>}
        </div>
      ))}
    </div>
  )
}
