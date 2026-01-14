import { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar'
import { projects } from '../../lib/api'

export default function AdminProjects() {
  const [items, setItems] = useState([])
  const [mod, setMod] = useState({ open: false, id: null, name: '', description: '' })
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
  const openNew = () => setMod({ open: true, id: null, name: '', description: '' })
  const openEdit = (p) => setMod({ open: true, id: p.id, name: p.name, description: p.description || '' })
  const save = async () => {
    if (!mod.name) return
    if (mod.id) {
      try {
        await projects.update(mod.id, { name: mod.name, description: mod.description })
      } catch (err) {
        alert(err?.response?.data?.detail || 'Failed to update project')
        return
      }
    } else {
      try {
        await projects.create({ name: mod.name, description: mod.description })
      } catch (err) {
        alert(err?.response?.data?.detail || 'Failed to create project')
        return
      }
    }
    setMod({ open: false, id: null, name: '', description: '' })
    await load()
  }
  const remove = async (id) => {
    try {
      await projects.remove(id)
      await load()
    } catch (err) {
      alert(err?.response?.data?.detail || 'Failed to delete project')
    }
  }
  return (
    <div className="flex bg-gradient-to-br from-white to-brand-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl hover:scale-[1.01] transition shadow-soft" onClick={openNew}>New Project</button>
        </div>
        <div className="bg-white rounded-xl overflow-hidden shadow-soft border border-slate-200">
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
                <tr key={p.id} className="hover:bg-brand-50 transition">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.description}</td>
                  <td className="p-4 space-x-2">
                    <button className="text-brand-700 hover:underline" onClick={() => openEdit(p)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => remove(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mod.open && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md space-y-3 shadow-hover p-6 border border-slate-200">
              <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name" value={mod.name} onChange={(e) => setMod((m) => ({ ...m, name: e.target.value }))} />
              <textarea className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Description" value={mod.description} onChange={(e) => setMod((m) => ({ ...m, description: e.target.value }))} />
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-2" onClick={() => setMod({ open: false, id: null, name: '', description: '' })}>Cancel</button>
                <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl hover:scale-[1.01] transition shadow-soft" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
