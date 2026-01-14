import { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar'
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
    <div className="flex bg-gradient-to-br from-white to-brand-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold">Tenant Settings</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-soft">
          <div className="flex items-center gap-3">
            <label className="w-40">Timezone</label>
            <input className="border rounded p-2 flex-1 focus:ring-2 focus:ring-brand-500" value={settings.config?.timezone || ''} onChange={(e) => updateConfig('timezone', e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-40">Chat Enabled</label>
            <input type="checkbox" checked={Boolean(settings.config?.chat_enabled)} onChange={(e) => updateConfig('chat_enabled', e.target.checked)} />
          </div>
          <button className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl shadow-soft" onClick={save}>Save</button>
        </div>
      </main>
    </div>
  )
}
