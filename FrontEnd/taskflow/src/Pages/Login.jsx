import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function Login() {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(creds.username, creds.password)
      navigate('/admin')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-900 to-accent-900 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-hover border border-slate-200 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text" placeholder="Username" required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
          />
          <input
            type="password" placeholder="Password" required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          />
          <button className="w-full bg-gradient-to-r from-brand-600 to-accent-600 text-white py-3 rounded-lg font-bold hover:scale-[1.01] transition shadow-soft">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
