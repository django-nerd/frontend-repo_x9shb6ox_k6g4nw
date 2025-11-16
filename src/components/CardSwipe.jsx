import { useState } from 'react'

export default function CardSwipe({ items, onLike, onDislike, onOpen }){
  const [index, setIndex] = useState(0)

  const item = items[index]

  const handle = (type) => {
    if(!item) return
    if(type==='like') onLike(item)
    if(type==='dislike') onDislike(item)
    setIndex(i => Math.min(i+1, items.length))
  }

  if(!item) return <div className="text-center text-gray-500 py-10">No more coachings. Adjust filters or add more.</div>

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {item.images && item.images[0] ? (
          <img src={item.images[0]} alt={item.name} className="h-56 w-full object-cover" />
        ) : (
          <div className="h-56 w-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-semibold">{item.city || 'Coaching'}</div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.address || item.city}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(item.exams||[]).slice(0,6).map((x,i)=> (
                  <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">{x}</span>
                ))}
              </div>
            </div>
            <button onClick={()=>onOpen(item)} className="text-blue-600 hover:text-blue-700 text-sm underline">View</button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button onClick={()=>handle('dislike')} className="px-5 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">Dislike</button>
        <button onClick={()=>handle('like')} className="px-5 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">Like</button>
      </div>
    </div>
  )
}
