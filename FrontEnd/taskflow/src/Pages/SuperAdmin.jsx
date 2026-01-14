import { useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import Sidebar from '../Components/Sidebar'
import { tenants } from '../lib/api'

export default function SuperAdmin() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [mod, setMod] = useState({ open: false, tenant_name: '', admin_username: '', admin_email: '' })
  const load = async () => {
    const r = await tenants.all()
    setItems(r.data)
  }
  useEffect(() => { load() }, [])
  const openNew = () => setMod({ open: true, tenant_name: '', admin_username: '', admin_email: '' })
  const save = async () => {
    await tenants.register({ tenant_name: mod.tenant_name, admin_username: mod.admin_username, admin_email: mod.admin_email })
    setMod({ open: false, tenant_name: '', admin_username: '', admin_email: '' })
    await load()
  }
  const remove = async (id) => { await tenants.delete(id); await load() }
  return (
    <div className="flex bg-gradient-to-br from-white to-brand-50 min-h-screen">
      <Sidebar role="admin" isSuper={user?.is_superuser} />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Global Admin: Tenants</h2>
          <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl hover:scale-[1.01] transition shadow-soft" onClick={openNew}>New Tenant</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className="border rounded-xl p-4 bg-white shadow-soft hover:shadow-hover transition hover:-translate-y-0.5 border-slate-200">
              <div className="font-bold">{t.name}</div>
              <div className="text-slate-600">ID: {t.id}</div>
              <div className="mt-3">
                <button className="text-red-600 hover:underline" onClick={() => remove(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        {mod.open && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md space-y-3 shadow-hover p-6 border border-slate-200">
              <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Organization Name" value={mod.tenant_name} onChange={(e) => setMod((m) => ({ ...m, tenant_name: e.target.value }))} />
              <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Admin Username" value={mod.admin_username} onChange={(e) => setMod((m) => ({ ...m, admin_username: e.target.value }))} />
              <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Admin Email" value={mod.admin_email} onChange={(e) => setMod((m) => ({ ...m, admin_email: e.target.value }))} />
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-2" onClick={() => setMod({ open: false, tenant_name: '', admin_username: '', admin_email: '' })}>Cancel</button>
                <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl hover:scale-[1.01] transition shadow-soft" onClick={save}>Create</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
