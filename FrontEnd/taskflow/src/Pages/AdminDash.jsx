import Sidebar from '../Components/Sidebar'
import { useAuth } from '../state/auth'
import { useEffect, useState } from 'react'
import { tenants, projects, tasks } from '../lib/api'

export default function AdminDash() {
  const { user } = useAuth()
  const [tenantsList, setTenantsList] = useState([])
  const [projCount, setProjCount] = useState('—')
  const [taskCount, setTaskCount] = useState('—')
  useEffect(() => {
    const load = async () => {
      try {
        if (user?.is_superuser) {
          const t = await tenants.all()
          setTenantsList(t.data)
          const p = await projects.list()
          const pc = Array.isArray(p.data) ? p.data.length : (p.data?.count ?? '—')
          setProjCount(pc)
          const s = await tasks.list()
          const tc = Array.isArray(s.data) ? s.data.length : (s.data?.count ?? '—')
          setTaskCount(tc)
        }
      } catch {}
    }
    load()
  }, [user])
  return (
    <div className="flex bg-gradient-to-br from-white to-brand-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {user?.is_superuser ? 'Global Admin Dashboard (Uzair)' : `Admin Dashboard (${user?.tenant?.name})`}
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-hover transition hover:-translate-y-0.5 border border-slate-200">
            <div className="text-slate-500">Users</div>
            <div className="text-3xl font-bold">—</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-hover transition hover:-translate-y-0.5 border border-slate-200">
            <div className="text-slate-500">Projects</div>
            <div className="text-3xl font-bold">{projCount}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-hover transition hover:-translate-y-0.5 border border-slate-200">
            <div className="text-slate-500">Open Tasks</div>
            <div className="text-3xl font-bold">{taskCount}</div>
          </div>
        </div>
        {user?.is_superuser && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-soft border border-slate-200">
            <h3 className="text-xl font-bold mb-4">Tenants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenantsList.map((t) => (
                <div key={t.id} className="rounded-xl p-4 border bg-gradient-to-br from-white to-brand-50">
                  <div className="font-bold">{t.name}</div>
                  <div className="text-slate-600">ID: {t.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
