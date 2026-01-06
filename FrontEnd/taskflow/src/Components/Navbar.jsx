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
    <nav className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">
          {user?.tenant?.name || 'Organization'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-blue-600 transition">
          <Bell size={20} />
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{user?.username}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
