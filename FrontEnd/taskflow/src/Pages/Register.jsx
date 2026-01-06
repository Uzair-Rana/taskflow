import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tenants } from '../lib/api'

export default function Register() {
  const [form, setForm] = useState({
    tenant_name: '',
    admin_username: '',
    admin_email: '',
    admin_password: '',
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await tenants.register(form)
      alert('Organization created')
      navigate('/login')
    } catch {
      alert('Error creating organization')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register Organization</h2>
        <div className="space-y-4">
          <input
            type="text" placeholder="Organization Name" required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setForm({ ...form, tenant_name: e.target.value })}
          />
          <input
            type="text" placeholder="Admin Username" required
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({ ...form, admin_username: e.target.value })}
          />
          <input
            type="email" placeholder="Admin Email" required
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({ ...form, admin_email: e.target.value })}
          />
          <input
            type="password" placeholder="Admin Password" required
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({ ...form, admin_password: e.target.value })}
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Create Organization
          </button>
        </div>
      </form>
    </div>
  )
}
