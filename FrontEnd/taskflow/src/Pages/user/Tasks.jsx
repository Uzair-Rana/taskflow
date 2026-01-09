import { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar'
import { tasks } from '../../lib/api'
import { useAuth } from '../../state/auth'

export default function UserTasks() {
  const [items, setItems] = useState([])
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState({ status: '', project: '' })
  const load = async () => {
    const r = await tasks.list(filter.status ? { status: filter.status } : undefined)
    setItems(r.data?.results || r.data)
  }
  const loadUsers = async () => {
    if (user?.role !== 'admin') return
    try {
      const r = await (await import('../../lib/api')).tenants.users()
      setUsers(r.data)
    } catch {}
  }
  useEffect(() => {
    load()
    loadUsers()
  }, [filter])
  const changeStatus = async (id, status) => {
    await tasks.status(id, { status })
    await load()
  }
  const addComment = async (id, body) => {
    await tasks.commentsAdd(id, { body })
    await load()
  }
  const assign = async (id, userIds) => {
    await tasks.assign(id, { user_ids: userIds })
    await load()
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar role="member" />
      <main className="flex-1 p-8 bg-white space-y-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex gap-3">
          <select className="border rounded p-2" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className="border rounded-xl p-4 space-y-2">
              <div className="font-bold">{t.title}</div>
              <div className="text-slate-600">{t.description}</div>
              <div className="text-sm">Status: {t.status}</div>
              <div className="flex gap-2">
                <button className="px-2 py-1 border rounded" onClick={() => changeStatus(t.id, 'todo')}>To Do</button>
                <button className="px-2 py-1 border rounded" onClick={() => changeStatus(t.id, 'in_progress')}>In Progress</button>
                <button className="px-2 py-1 border rounded" onClick={() => changeStatus(t.id, 'done')}>Done</button>
              </div>
              {user?.role === 'admin' && (
                <div className="flex gap-2 items-center">
                  <span className="text-sm">Assign:</span>
                  <select multiple className="border rounded p-2" onChange={(e) => {
                    const ids = Array.from(e.target.selectedOptions).map((o) => Number(o.value))
                    assign(t.id, ids)
                  }}>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-2">
                <input className="flex-1 border rounded p-2" placeholder="Comment" onKeyDown={(e) => {
                  if (e.key === 'Enter') addComment(t.id, e.target.value)
                }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
