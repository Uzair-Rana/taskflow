import { NavLink } from 'react-router-dom'
import { Layout, Users, Folder, Settings, ActivitySquare, MessageSquare, ListChecks } from 'lucide-react'

const Sidebar = ({ role, isSuper = false }) => {
  const admin = [
    { name: 'Dashboard', to: '/admin', icon: Layout },
    { name: 'Users', to: '/admin/users', icon: Users },
    { name: 'Projects', to: '/admin/projects', icon: Folder },
    { name: 'Settings', to: '/admin/settings', icon: Settings },
    { name: 'Activity', to: '/admin/activity', icon: ActivitySquare },
    { name: 'Chat', to: '/chat', icon: MessageSquare },
  ]
  const user = [
    { name: 'Dashboard', to: '/user', icon: Layout },
    { name: 'Projects', to: '/user/projects', icon: Folder },
    { name: 'Tasks', to: '/user/tasks', icon: ListChecks },
    { name: 'Chat', to: '/chat', icon: MessageSquare },
  ]
  const extra = isSuper ? [{ name: 'Super Admin', to: '/superadmin', icon: Users }] : []
  const links = role === 'admin' ? [...extra, ...admin] : user
  return (
    <div className={`w-64 min-h-screen p-6 ${role === 'admin' ? 'bg-gradient-to-b from-slate-950 via-brand-800 to-accent-900 text-white' : 'bg-white/80 backdrop-blur border-r border-slate-200 text-slate-800'}`}>
      <div className={`mb-8 font-extrabold text-2xl tracking-tight ${role === 'admin' ? 'bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-accent-200' : 'text-slate-900'}`}>TeamFlow</div>
      <nav className="space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl transition duration-300 ${role === 'admin'
                ? isActive
                  ? 'bg-white/10 ring-1 ring-white/20'
                  : 'hover:bg-white/10'
                : isActive
                  ? 'bg-brand-600 text-white'
                  : 'hover:bg-brand-50'}`}
          >
            {l.icon && <l.icon size={18} className={role === 'admin' ? 'text-brand-200' : 'text-slate-600'} />}
            <span className="font-medium">{l.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
