import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../state/auth'
import Sidebar from '../components/Sidebar'
import { chat } from '../lib/api'

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [body, setBody] = useState('')
  const wsRef = useRef(null)
  const load = async () => {
    const r = await chat.messages()
    setMessages(r.data)
  }
  useEffect(() => {
    load()
  }, [])
  useEffect(() => {
    if (!user) return
    const url = `ws://localhost:8000/ws/chat/${user.tenant.id}/?token=${localStorage.getItem('access')}`
    const ws = new WebSocket(url)
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data)
      setMessages((m) => [...m, d])
    }
    wsRef.current = ws
    return () => ws.close()
  }, [user])
  const send = () => {
    if (!wsRef.current || !body) return
    wsRef.current.send(JSON.stringify({ body }))
    setBody('')
  }
  const role = user?.role === 'admin' ? 'admin' : 'member'
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <main className="flex-1 p-8 bg-white">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <div className="border rounded-xl p-4 h-[60vh] overflow-auto space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="font-medium">{m.author?.username || 'user'}</div>
              <div>{m.body}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input className="border rounded p-2 flex-1" value={body} onChange={(e) => setBody(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={send}>Send</button>
        </div>
      </main>
    </div>
  )
}
