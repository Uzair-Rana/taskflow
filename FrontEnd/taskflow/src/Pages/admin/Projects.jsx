import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { projects } from '../../lib/api'

export default function AdminProjects() {
  const [items, setItems] = useState([])
  const [mod, setMod] = useState({ open: false, id: null, name: '', description: '' })
  const load = async () => {
    const r = await projects.list()
    setItems(r.data)
  }
  useEffect(() => {
    load()
  }, [])
  const openNew = () => setMod({ open: true, id: null, name: '', description: '' })
  const openEdit = (p) => setMod({ open: true, id: p.id, name: p.name, description: p.description || '' })
  const save = async () => {
    if (!mod.name) return
    if (mod.id) {
      await projects.update(mod.id, { name: mod.name, description: mod.description })
    } else {
      await projects.create({ name: mod.name, description: mod.description })
    }
    setMod({ open: false, id: null, name: '', description: '' })
    await load()
  }
  const remove = async (id) => {
    await projects.remove(id)
    await load()
  }
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={openNew}>New Project</button>
        </div>
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.description}</td>
                  <td className="p-4 space-x-2">
                    <button className="text-blue-600" onClick={() => openEdit(p)}>Edit</button>
                    <button className="text-red-600" onClick={() => remove(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mod.open && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Name" value={mod.name} onChange={(e) => setMod((m) => ({ ...m, name: e.target.value }))} />
              <textarea className="w-full border p-2 rounded" placeholder="Description" value={mod.description} onChange={(e) => setMod((m) => ({ ...m, description: e.target.value }))} />
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-2" onClick={() => setMod({ open: false, id: null, name: '', description: '' })}>Cancel</button>
                <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
