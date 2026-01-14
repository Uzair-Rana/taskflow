import { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar'
import { projects } from '../../lib/api'

export default function UserProjects() {
  const [items, setItems] = useState([])
  const load = async () => {
    try {
      const r = await projects.list()
      setItems(r.data?.results || r.data)
    } catch (err) {
      alert(err?.response?.data?.detail || 'Failed to load projects')
    }
  }
  useEffect(() => {
    load()
  }, [])
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-brand-50">
      <Sidebar role="member" />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p) => (
            <div key={p.id} className="border rounded-xl p-4 bg-white shadow-soft hover:shadow-hover transition hover:-translate-y-0.5 border-slate-200 hover:bg-brand-50">
              <div className="font-bold">{p.name}</div>
              <div className="text-slate-600">{p.description}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
