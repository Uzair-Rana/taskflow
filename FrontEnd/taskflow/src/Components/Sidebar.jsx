import { NavLink } from 'react-router-dom'

const Sidebar = ({ role }) => {
  const admin = [
    { name: 'Dashboard', to: '/admin' },
    { name: 'Users', to: '/admin/users' },
    { name: 'Projects', to: '/admin/projects' },
    { name: 'Settings', to: '/admin/settings' },
    { name: 'Activity', to: '/admin/activity' },
    { name: 'Chat', to: '/chat' },
  ]
  const user = [
    { name: 'Dashboard', to: '/user' },
    { name: 'Projects', to: '/user/projects' },
    { name: 'Tasks', to: '/user/tasks' },
    { name: 'Chat', to: '/chat' },
  ]
  const links = role === 'admin' ? admin : user
  return (
    <div className={`w-64 min-h-screen p-4 ${role === 'admin' ? 'bg-slate-900 text-white' : 'bg-white border-r text-slate-800'}`}>
      <h1 className="text-xl font-bold mb-8">TeamFlow</h1>
      <nav className="space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `block p-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}
          >
            {l.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
