import { useEffect, useMemo, useState } from 'react'
import Filters from './components/Filters'
import CardSwipe from './components/CardSwipe'
import DetailDrawer from './components/DetailDrawer'

const API = import.meta.env.VITE_BACKEND_URL

export default function App(){
  const [items, setItems] = useState([])
  const [params, setParams] = useState({})
  const [tab, setTab] = useState('discover') // discover | liked | disliked
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)

  const qs = useMemo(()=>{
    const u = new URLSearchParams()
    Object.entries(params).forEach(([k,v])=>{ if(v!==undefined && v!=='') u.append(k, v) })
    return u.toString()
  },[params])

  const fetchData = async () => {
    const res = await fetch(`${API}/coachings?${qs}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  useEffect(()=>{ fetchData() }, [qs])

  const like = async (item) => {
    await fetch(`${API}/coaching/${item.id}/status`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status: 'liked' })})
    fetchData()
  }
  const dislike = async (item) => {
    await fetch(`${API}/coaching/${item.id}/status`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status: 'disliked' })})
    fetchData()
  }

  const openDetails = (item) => { setCurrent(item); setOpen(true) }
  const onStatusChange = async (item, status) => {
    await fetch(`${API}/coaching/${item.id}/status`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status })})
    setOpen(false)
    fetchData()
  }

  useEffect(()=>{
    if(tab==='liked') setParams(p=>({ ...p, status:'liked' }))
    else if(tab==='disliked') setParams(p=>({ ...p, status:'disliked' }))
    else setParams(p=>{ const { status, ...rest } = p; return rest })
  },[tab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Coaching Leads</h1>
          <nav className="bg-white/80 border border-gray-100 rounded-full p-1 inline-flex">
            {['discover','liked','disliked'].map(t => (
              <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-full text-sm ${tab===t? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </nav>
        </header>

        <div className="mt-4">
          <Filters onChange={setParams} />
        </div>

        <div className="mt-6">
          <CardSwipe items={items} onLike={like} onDislike={dislike} onOpen={openDetails} />
        </div>
      </div>

      <DetailDrawer open={open} item={current} onClose={()=>setOpen(false)} onStatusChange={onStatusChange} />
    </div>
  )
}
