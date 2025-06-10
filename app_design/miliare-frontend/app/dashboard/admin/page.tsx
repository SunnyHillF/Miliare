'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const userIsAdmin = true // TODO: replace with real logic
      if (userIsAdmin) {
        setIsAdmin(true)
      } else {
        router.replace('/login')
      }
      setLoading(false)
    }
    checkAdmin()
  }, [router])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!isAdmin) return null

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Manage users, view reports, and configure settings.
      </p>
    </div>
  )
}
