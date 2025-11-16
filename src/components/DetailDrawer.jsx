import { useEffect, useState } from 'react'

function MapEmbed({ url, lat, lng }){
  if(url){
    return <iframe title="map" src={url.replace('https://www.google.com/maps/place/','https://www.google.com/maps?q=')} className="w-full h-48 rounded-md border" loading="lazy" allowFullScreen></iframe>
  }
  if(lat && lng){
    const u = `https://www.google.com/maps?q=${lat},${lng}`
    return <iframe title="map" src={u} className="w-full h-48 rounded-md border" loading="lazy" allowFullScreen></iframe>
  }
  return <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">No map</div>
}

export default function DetailDrawer({ open, item, onClose, onStatusChange }){
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState({ title:'', content:'', stage:'', next_action:'', next_action_date:'' })
  const [agentQ, setAgentQ] = useState('')
  const [agentRes, setAgentRes] = useState(null)

  useEffect(()=>{
    if(open && item){
      fetch(`${import.meta.env.VITE_BACKEND_URL}/coaching/${item.id}/notes`).then(r=>r.json()).then(d=>setNotes(d.items||[]))
    }
  },[open, item?.id])

  const addNote = async () => {
    const payload = { ...note, coaching_id: item.id }
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/coaching/${item.id}/notes`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
    if(res.ok){
      setNote({ title:'', content:'', stage:'', next_action:'', next_action_date:'' })
      const d = await fetch(`${import.meta.env.VITE_BACKEND_URL}/coaching/${item.id}/notes`).then(r=>r.json())
      setNotes(d.items||[])
    }
  }

  const sendAgent = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/coaching/${item.id}/agent`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: agentQ })})
    const data = await res.json()
    setAgentRes(data)
  }

  if(!open || !item) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-4" onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.address} {item.city?`• ${item.city}`:''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>onStatusChange(item,'disliked')} className={`px-3 py-1 rounded-full border ${item.status==='disliked'?'bg-red-600 text-white border-red-600':'bg-red-50 text-red-600 border-red-200'}`}>Dislike</button>
            <button onClick={()=>onStatusChange(item,'liked')} className={`px-3 py-1 rounded-full border ${item.status==='liked'?'bg-green-600 text-white border-green-600':'bg-green-50 text-green-700 border-green-200'}`}>Like</button>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div>
            {item.images && item.images[0] && (
              <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover rounded-md border" />
            )}
            <div className="mt-3">
              <MapEmbed url={item.google_maps_url} lat={item?.location?.lat} lng={item?.location?.lng} />
            </div>
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              {item.phone && <div><span className="font-medium">Phone:</span> {item.phone}</div>}
              {item.website && <div><span className="font-medium">Website:</span> <a className="text-blue-600 underline" href={item.website} target="_blank">{item.website}</a></div>}
              {item.google_maps_url && <div><span className="font-medium">Maps:</span> <a className="text-blue-600 underline" href={item.google_maps_url} target="_blank">View</a></div>}
              {item.exams?.length ? <div className="flex flex-wrap gap-2 mt-2">{item.exams.map((x,i)=> <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">{x}</span>)}</div> : null}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Notes & Next Actions</h3>
            <div className="mt-2 space-y-2">
              <input value={note.title} onChange={e=>setNote(n=>({...n,title:e.target.value}))} placeholder="Title (e.g., First meet)" className="w-full px-3 py-2 border rounded-md" />
              <textarea value={note.content} onChange={e=>setNote(n=>({...n,content:e.target.value}))} placeholder="What happened" className="w-full px-3 py-2 border rounded-md min-h-[80px]" />
              <div className="flex gap-2">
                <input value={note.stage} onChange={e=>setNote(n=>({...n,stage:e.target.value}))} placeholder="Stage" className="px-3 py-2 border rounded-md flex-1" />
                <input value={note.next_action_date} onChange={e=>setNote(n=>({...n,next_action_date:e.target.value}))} placeholder="Next action date" className="px-3 py-2 border rounded-md flex-1" />
              </div>
              <input value={note.next_action} onChange={e=>setNote(n=>({...n,next_action:e.target.value}))} placeholder="Next action" className="w-full px-3 py-2 border rounded-md" />
              <button onClick={addNote} className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Note</button>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">History</h4>
              <div className="divide-y border rounded-md mt-2">
                {notes.length===0 && <div className="p-3 text-sm text-gray-500">No notes yet.</div>}
                {notes.map(n => (
                  <div key={n.id} className="p-3 text-sm">
                    <div className="font-medium">{n.title || 'Note'}</div>
                    <div className="text-gray-700 whitespace-pre-wrap">{n.content}</div>
                    <div className="text-xs text-gray-500 mt-1">Stage: {n.stage || '-'} • Next: {n.next_action || '-'} {n.next_action_date?`(${n.next_action_date})`:''}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">AI Assistant</h3>
              <div className="flex gap-2 mt-2">
                <input value={agentQ} onChange={e=>setAgentQ(e.target.value)} placeholder="Ask about this coaching" className="flex-1 px-3 py-2 border rounded-md" />
                <button onClick={sendAgent} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Ask</button>
              </div>
              {agentRes && (
                <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-md text-sm">
                  <div className="font-medium">{agentRes.answer}</div>
                  <ul className="list-disc pl-5 mt-1 text-indigo-900">
                    {(agentRes.suggestions||[]).map((s,i)=> <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 rounded-md border" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
