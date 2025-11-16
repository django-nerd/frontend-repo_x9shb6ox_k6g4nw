import { useState, useEffect } from 'react'

const EXAMS = ["IIT JEE","NEET","UPSC","SSC","CAT","CLAT","GATE","BANKING","RAILWAYS","FOUNDATION"]

export default function Filters({ onChange }) {
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')
  const [selectedExams, setSelectedExams] = useState([])
  const [sizeMin, setSizeMin] = useState('')
  const [sizeMax, setSizeMax] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = {
      city: city || undefined,
      exams: selectedExams.join(',') || undefined,
      min_size: sizeMin || undefined,
      max_size: sizeMax || undefined,
      status: status || undefined,
      q: query || undefined,
    }
    onChange(params)
  }, [city, selectedExams, sizeMin, sizeMax, status, query])

  const toggleExam = (exam) => {
    setSelectedExams(prev => prev.includes(exam) ? prev.filter(e => e!==exam) : [...prev, exam])
  }

  const crawl = async () => {
    if(!city) return alert('Enter a city to crawl')
    setLoading(true)
    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/crawl`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ city, exams: selectedExams, limit: 20 })
      })
      const data = await res.json()
      alert(`Crawled ${data.scanned} sources, added ${data.created} new coachings`)
    }catch(e){
      alert('Crawl failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex flex-wrap gap-3 items-center">
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City (e.g., Kota)" className="px-3 py-2 border rounded-md" />
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name/address" className="px-3 py-2 border rounded-md flex-1 min-w-[180px]" />
        <input value={sizeMin} onChange={e=>setSizeMin(e.target.value)} placeholder="Min size" className="px-3 py-2 border rounded-md w-28" />
        <input value={sizeMax} onChange={e=>setSizeMax(e.target.value)} placeholder="Max size" className="px-3 py-2 border rounded-md w-28" />
        <select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2 border rounded-md">
          <option value="">All</option>
          <option value="liked">Liked</option>
          <option value="disliked">Disliked</option>
          <option value="neutral">Neutral</option>
        </select>
        <button onClick={crawl} disabled={loading} className={`px-4 py-2 rounded-md text-white ${loading? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{loading? 'Crawling...' : 'Crawl Internet'}</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMS.map(ex => (
          <button key={ex} onClick={()=>toggleExam(ex)} className={`px-3 py-1 rounded-full border text-sm ${selectedExams.includes(ex) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}>
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
