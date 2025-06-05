'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface SettingsState {
  marketingEmails: boolean
  darkMode: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    marketingEmails: false,
    darkMode: false,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('settings')
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch {
        // ignore invalid stored value
      }
    }
  }, [])

  // Persist settings whenever they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={settings.marketingEmails}
              onChange={(e) =>
                setSettings({ ...settings, marketingEmails: e.target.checked })
              }
            />
            Receive marketing emails
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={settings.darkMode}
              onChange={(e) =>
                setSettings({ ...settings, darkMode: e.target.checked })
              }
            />
            Enable dark mode
          </label>
          <Button className="w-full mt-4" disabled>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
