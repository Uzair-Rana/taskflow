import { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar'
import { tenants, usersApi } from '../../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invite, setInvite] = useState({ username: '', email: '', password: '', role: 'member' })
  const load = async () => {
    const r = await tenants.users()
    setUsers(r.data)
  }
  useEffect(() => {
    load()
  }, [])
  const submitInvite = async () => {
    try {
      const r = await tenants.invite(invite)
      const temp = r.data?.temp_password
      const url = r.data?.login_url
      alert(`User invited. Temporary password: ${temp}\nLogin: ${url}`)
      setInviteOpen(false)
      setInvite({ username: '', email: '', password: '', role: 'member' })
      await load()
    } catch (err) {
      alert(err?.response?.data?.detail || 'Invite failed')
    }
  }
  const changeRole = async (id, role) => {
    await usersApi.role(id, { role })
    await load()
  }
  const deactivate = async (id) => {
    await usersApi.deactivate(id)
    await load()
  }
  return (
    <div className="flex bg-gradient-to-br from-white to-brand-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Tenant Users</h2>
          <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl shadow-soft" onClick={() => setInviteOpen(true)}>
            Invite User
          </button>
        </header>
        <div className="bg-white rounded-xl shadow-soft border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-4">{u.username}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4 space-x-2">
                    <select className="border rounded p-1 focus:ring-2 focus:ring-brand-500" defaultValue={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                      <option value="admin">admin</option>
                      <option value="manager">manager</option>
                      <option value="member">member</option>
                    </select>
                    <button className="text-red-600" onClick={() => deactivate(u.id)}>Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inviteOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-3 shadow-hover border border-slate-200">
              <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500" placeholder="Username" onChange={(e) => setInvite({ ...invite, username: e.target.value })} />
              <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500" placeholder="Email" type="email" onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
              <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500" placeholder="Password (optional)" type="password" onChange={(e) => setInvite({ ...invite, password: e.target.value })} />
              <select className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-500" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-2" onClick={() => setInviteOpen(false)}>Cancel</button>
                <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl shadow-soft" onClick={submitInvite}>Invite</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
