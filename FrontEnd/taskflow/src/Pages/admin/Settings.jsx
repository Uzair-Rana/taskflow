import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { tenants } from '../../lib/api'

export default function AdminSettings() {
  const [settings, setSettings] = useState({ config: {} })
  const load = async () => {
    const r = await tenants.settingsGet()
    setSettings(r.data)
  }
  useEffect(() => {
    load()
  }, [])
  const save = async () => {
    await tenants.settingsPatch({ config: settings.config })
    await load()
  }
  const updateConfig = (key, value) => {
    setSettings((s) => ({ ...s, config: { ...s.config, [key]: value } }))
  }
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold">Tenant Settings</h2>
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <label className="w-40">Timezone</label>
            <input className="border rounded p-2 flex-1" value={settings.config?.timezone || ''} onChange={(e) => updateConfig('timezone', e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-40">Chat Enabled</label>
            <input type="checkbox" checked={Boolean(settings.config?.chat_enabled)} onChange={(e) => updateConfig('chat_enabled', e.target.checked)} />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={save}>Save</button>
        </div>
      </main>
    </div>
  )
}
