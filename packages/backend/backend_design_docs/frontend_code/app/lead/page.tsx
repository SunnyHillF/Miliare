"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/apiClient'
import type { LeadUser } from '@/lib/leadUsers'

export default function LeadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isLead, setIsLead] = useState(false)
  const [users, setUsers] = useState<LeadUser[]>([])

  useEffect(() => {
    async function checkLead() {
      try {
        const { fetchAuthSession } = await import('aws-amplify/auth')
        const { tokens } = await fetchAuthSession()
        const groups: string[] = (tokens?.accessToken?.payload['cognito:groups'] as string[]) || []

        if (groups.includes('lead')) {
          setIsLead(true)
          try {
            const data = await apiRequest<LeadUser[]>('/lead/users')
            setUsers(data)
          } catch {
            const { leadUsers } = await import('@/lib/leadUsers')
            setUsers(leadUsers)
          }
        } else {
          router.replace('/login')
        }
      } catch {
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    checkLead()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isLead) {
    return null
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Lead Dashboard</h1>
      <p className="text-gray-600 mb-6">View and manage your assigned users.</p>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="bg-white shadow p-4 rounded">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
