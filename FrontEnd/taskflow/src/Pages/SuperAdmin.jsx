import { useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import Sidebar from '../Components/Sidebar'
import { tenants } from '../lib/api'

export default function SuperAdmin() {
  const { user } = useAuth()
  const [gate, setGate] = useState(() => ({ ok: typeof window !== 'undefined' && sessionStorage.getItem('super_gate_ok') === '1', name: '', pass: '' }))
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('details')
  const [form, setForm] = useState({ tenant_name: '', admin_username: '', admin_email: '', admin_password: '' })
  const load = async () => {
    const r = await tenants.all()
    setItems(r.data)
  }
  useEffect(() => { load() }, [])
  const openNew = () => { setActiveTab('add'); setForm({ tenant_name: '', admin_username: '', admin_email: '', admin_password: '' }) }
  const save = async () => {
    try {
      const payload = { tenant_name: form.tenant_name, admin_username: form.admin_username, admin_email: form.admin_email }
      if (form.admin_password) payload.admin_password = form.admin_password
      const r = await tenants.register(payload)
      const d = r?.data || {}
      const sent = typeof d.email_sent !== 'undefined' ? `\nEmail sent: ${d.email_sent ? 'Yes' : 'No'}` : ''
      const errLine = d.email_error ? `\nEmail error: ${d.email_error}` : ''
      alert(`Tenant created. Admin credentials:\nUsername: ${d.admin_username}\nPassword: ${d.temp_password}\nLogin: ${d.login_url}${sent}${errLine}`)
      setForm({ tenant_name: '', admin_username: '', admin_email: '', admin_password: '' })
      setActiveTab('details')
      await load()
    } catch (err) {
      const data = err?.response?.data
      const msg = data?.message || data?.detail || (data && Array.isArray(data) ? data[0] : (typeof data === 'object' ? (Object.values(data)[0]?.[0] || Object.values(data)[0]) : null)) || 'Error creating tenant'
      alert(msg)
    }
  }
  const remove = async (id) => { await tenants.delete(id); await load() }
  const unlock = () => {
    if (gate.name.trim() === 'Uzair' && gate.pass === 'zairry') {
      setGate({ ...gate, ok: true })
      sessionStorage.setItem('super_gate_ok', '1')
    } else {
      alert('Invalid credentials')
    }
  }
  if (!gate.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-brand-50 p-6">
        <div className="bg-white rounded-2xl w-full max-w-sm space-y-3 shadow-hover p-6 border border-slate-200">
          <h2 className="text-xl font-bold">Super Admin Access</h2>
          <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name" value={gate.name} onChange={(e) => setGate((g) => ({ ...g, name: e.target.value }))} />
          <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" type="password" placeholder="Password" value={gate.pass} onChange={(e) => setGate((g) => ({ ...g, pass: e.target.value }))} />
          <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl hover:scale-[1.01] transition shadow-soft w-full" onClick={unlock}>Submit</button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex bg-gradient-to-br from-white to-brand-50 min-h-screen">
      <Sidebar role="admin" isSuper={user?.is_superuser} />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <div className="inline-flex bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <button
              className={`px-4 py-2 ${activeTab === 'add' ? 'bg-black text-white' : 'text-slate-700 hover:bg-brand-50'}`}
              onClick={() => setActiveTab('add')}
            >
              Add Tenant
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'details' ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-brand-50'}`}
              onClick={() => setActiveTab('details')}
            >
              Tenant Details
            </button>
          </div>
        </div>
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl w-full max-w-xl space-y-3 shadow-hover p-6 border border-slate-200">
            <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Organization Name" value={form.tenant_name} onChange={(e) => setForm((m) => ({ ...m, tenant_name: e.target.value }))} />
            <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Admin Username" value={form.admin_username} onChange={(e) => setForm((m) => ({ ...m, admin_username: e.target.value }))} />
            <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Admin Email" value={form.admin_email} onChange={(e) => setForm((m) => ({ ...m, admin_email: e.target.value }))} />
            <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Admin Password (optional)" type="password" value={form.admin_password} onChange={(e) => setForm((m) => ({ ...m, admin_password: e.target.value }))} />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-2" onClick={() => setForm({ tenant_name: '', admin_username: '', admin_email: '', admin_password: '' })}>Reset</button>
              <button className="bg-black text-white px-4 py-2 rounded-xl hover:scale-[1.01] transition shadow-soft" onClick={save}>Register</button>
            </div>
          </div>
        )}
        {activeTab === 'details' && (
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
        )}
      </main>
    </div>
  )
}
