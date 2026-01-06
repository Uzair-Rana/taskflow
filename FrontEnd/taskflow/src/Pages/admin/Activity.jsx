import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { api } from '../../lib/api'

export default function Activity() {
  const [logs, setLogs] = useState([])
  const load = async () => {
    const r = await api.get('/api/activity/')
    setLogs(r.data)
  }
  useEffect(() => {
    load()
  }, [])
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8 space-y-4">
        <h2 className="text-2xl font-bold">Activity</h2>
        <div className="bg-white border rounded-xl">
          <ul className="divide-y">
            {logs.map((l) => (
              <li key={l.id} className="p-4 flex justify-between">
                <div>
                  <div className="font-medium">{l.action}</div>
                  <div className="text-sm text-slate-500">{l.target_type} #{l.target_id}</div>
                </div>
                <div className="text-sm text-slate-500">{l.created_at}</div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
