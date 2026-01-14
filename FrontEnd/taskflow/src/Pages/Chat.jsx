import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../state/auth'
import Sidebar from '../Components/Sidebar'
import { chat } from '../lib/api'

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [body, setBody] = useState('')
  const [connected, setConnected] = useState(false)
  const [retry, setRetry] = useState(0)
  const [loadError, setLoadError] = useState(null)
  const wsRef = useRef(null)
  const load = async () => {
    try {
      const r = await chat.messages()
      setMessages(r.data)
      setLoadError(null)
    } catch (err) {
      setLoadError('Failed to load messages')
    }
  }
  useEffect(() => {
    load()
  }, [])
  useEffect(() => {
    if (!user || !user.tenant?.id) return
    let active = true
    const connect = () => {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const url = `${proto}://${window.location.host}/ws/chat/${user.tenant.id}/?token=${localStorage.getItem('access')}`
      const ws = new WebSocket(url)
      ws.onopen = () => { setConnected(true); setRetry(0) }
      ws.onmessage = (e) => { const d = JSON.parse(e.data); setMessages((m) => [...m, d]) }
      ws.onclose = () => {
        setConnected(false)
        if (!active) return
        const next = Math.min(5000, 1000 * (retry + 1))
        setTimeout(() => { setRetry((r) => r + 1); connect() }, next)
      }
      ws.onerror = () => { try { ws.close() } catch {} }
      wsRef.current = ws
    }
    connect()
    return () => { active = false; try { wsRef.current?.close() } catch {} }
  }, [user])
  const send = () => {
    if (!wsRef.current || !body) return
    wsRef.current.send(JSON.stringify({ body }))
    setBody('')
  }
  const role = (user?.is_superuser || user?.role === 'admin') ? 'admin' : 'member'
  const hasTenant = !!user?.tenant?.id
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-brand-50">
      <Sidebar role={role} />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Chat {connected ? '' : '(reconnecting...)'}</h2>
        {!hasTenant && (
          <div className="bg-white rounded-xl p-4 shadow-soft border border-slate-200">
            <p className="text-slate-700">No tenant context. Please switch to a tenant to use Chat.</p>
          </div>
        )}
        {hasTenant && (
          <>
            <div className="bg-white rounded-xl p-4 h-[60vh] overflow-auto space-y-3 shadow-soft border border-slate-200">
              {loadError && (
                <div className="text-red-600">{loadError}</div>
              )}
              {messages.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 text-white flex items-center justify-center text-xs font-bold">
                    {(m.author?.username || 'U').slice(0,1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{m.author?.username || 'user'}</div>
                    <div className="mt-1 inline-block bg-slate-100 rounded-xl px-3 py-2">{m.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="border rounded-xl p-3 flex-1 focus:ring-2 focus:ring-brand-500 outline-none" value={body} onChange={(e) => setBody(e.target.value)} />
              <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-5 py-3 rounded-xl hover:scale-[1.01] transition shadow-soft" onClick={send}>Send</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
