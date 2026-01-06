import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { tenants, usersApi } from '../../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invite, setInvite] = useState({ username: '', email: '', password: '' })
  const load = async () => {
    const r = await tenants.users()
    setUsers(r.data)
  }
  useEffect(() => {
    load()
  }, [])
  const submitInvite = async () => {
    await tenants.invite(invite)
    setInviteOpen(false)
    setInvite({ username: '', email: '', password: '' })
    await load()
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
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Tenant Users</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setInviteOpen(true)}>
            Invite User
          </button>
        </header>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                    <select className="border rounded p-1" defaultValue={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
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
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Username" onChange={(e) => setInvite({ ...invite, username: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Email" type="email" onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Password" type="password" onChange={(e) => setInvite({ ...invite, password: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-2" onClick={() => setInviteOpen(false)}>Cancel</button>
                <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={submitInvite}>Invite</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
