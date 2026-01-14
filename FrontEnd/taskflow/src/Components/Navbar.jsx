import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function Navbar({ user }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="h-16 bg-gradient-to-r from-white to-brand-50 border-b border-slate-200 px-6 flex items-center justify-between shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white font-bold">
          {(user?.tenant?.name || 'O').slice(0,1).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-slate-700">
          {user?.tenant?.name || 'Organization'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-brand-600 transition">
          <Bell size={20} />
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{user?.username}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.is_superuser ? 'global admin' : user?.role}</p>
          </div>
          <button onClick={handleLogout} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-brand-100 hover:text-brand-700 transition">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
