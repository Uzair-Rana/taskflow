import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { projects } from '../../lib/api'

export default function UserProjects() {
  const [items, setItems] = useState([])
  const load = async () => {
    const r = await projects.list()
    setItems(r.data)
  }
  useEffect(() => {
    load()
  }, [])
  return (
    <div className="flex min-h-screen">
      <Sidebar role="member" />
      <main className="flex-1 p-8 bg-white">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p) => (
            <div key={p.id} className="border rounded-xl p-4">
              <div className="font-bold">{p.name}</div>
              <div className="text-slate-600">{p.description}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
