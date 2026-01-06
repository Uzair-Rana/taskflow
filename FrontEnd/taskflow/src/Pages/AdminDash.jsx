import Sidebar from '../components/Sidebar'
import { useAuth } from '../state/auth'

export default function AdminDash() {
  const { user } = useAuth()
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Admin Dashboard ({user?.tenant?.name})</h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-6">
            <div className="text-slate-500">Users</div>
            <div className="text-3xl font-bold">—</div>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <div className="text-slate-500">Projects</div>
            <div className="text-3xl font-bold">—</div>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <div className="text-slate-500">Open Tasks</div>
            <div className="text-3xl font-bold">—</div>
          </div>
        </div>
      </main>
    </div>
  )
}
