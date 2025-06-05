'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, ArrowDownRight, Eye, Calendar, DollarSign, Clock, Users, TrendingUp } from 'lucide-react'
import type { DashboardDataResponse } from '@/lib/dashboardQueries'
import { fetchDashboardData } from '@/lib/dashboardQueries'
import { chartConfig } from '@/lib/dashboardData'

const EarningsOverviewChart = dynamic(
  () => import('@/components/EarningsOverviewChart'),
  { ssr: false }
)

export default function BusinessDashboard() {
  const [period, setPeriod] = useState('Last 6 months')
  const [data, setData] = useState<DashboardDataResponse | null>(null)
  const [isLead, setIsLead] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { getCurrentUser, fetchAuthSession } = await import('aws-amplify/auth')
      const user = await getCurrentUser()
      const { tokens } = await fetchAuthSession()
      const groups: string[] = (tokens?.accessToken?.payload['cognito:groups'] as string[]) || []
      setIsLead(groups.includes('lead'))
      setIsAdmin(groups.includes('admin'))
      try {
        const result = await fetchDashboardData()
        setData(result)
      } catch {
        setData(null)
      }
    }
    load()
  }, [])

  if (!data) {
    return <div className="p-6">Loading...</div>
  }

  const metrics = data.dashboardMetrics
  const summary = [
    {
      label: 'Total Earnings',
      value: `$${metrics.totalEarnings.toFixed(2)}`,
      change: '',
      changeType: 'positive' as const,
      description: 'so far',
      icon: 'DollarSign',
      gradient: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Pending Commissions',
      value: String(metrics.pendingCommissions),
      change: '',
      changeType: 'neutral' as const,
      description: 'awaiting payout',
      icon: 'Clock',
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      label: 'Total Referrals',
      value: String(metrics.totalReferrals),
      change: '',
      changeType: 'positive' as const,
      description: 'lifetime',
      icon: 'Users',
      gradient: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate.toFixed(0)}%`,
      change: '',
      changeType: 'positive' as const,
      description: 'paid referrals',
      icon: 'TrendingUp',
      gradient: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
  ]

  const pendingReferrals = data.referrals.filter(r => r.status !== 'PAID').slice(0, 3).map(r => ({
    date: new Date(r.createdAt).toLocaleDateString(),
    client: r.clientName,
    company: r.companyId,
    status: r.status.replace('_', ' '),
    amount: r.amount ? `$${r.amount.toFixed(2)}` : '$0',
    statusColor: r.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800',
  }))

  const recentPayments = data.payments.slice(0, 4).map(p => ({
    company: p.referralId,
    date: new Date(p.date).toLocaleDateString(),
    amount: `$${p.amount.toFixed(2)}`,
    status: p.status,
    initials: p.referralId.slice(0,2).toUpperCase(),
    bgColor: 'bg-blue-600',
  }))

  const earningsData6Months = data.earnings6
  const earningsData12Months = data.earnings12
  const earningsDataYear = data.earnings12

  const earningsDataMap: Record<string, typeof earningsData6Months> = {
    'Last 6 months': earningsData6Months,
    'Last 12 months': earningsData12Months,
    'This year': earningsDataYear,
  }

  const chartData = earningsDataMap[period] ?? earningsData6Months

  // Create a mapping for the specific icons we need
  const iconMap: Record<string, any> = {
    DollarSign,
    Clock,
    Users,
    TrendingUp
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Business Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Track your referrals, earnings, and commission performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Eye className="h-4 w-4" />
              View Reports
            </Button>
        </div>
      </div>

        {(isLead || isAdmin) && (
          <div className="flex gap-3 mt-2">
            {isLead && (
              <Button variant="outline" onClick={() => router.push('/lead')}>
                Lead Dashboard
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" onClick={() => router.push('/admin')}>
                Admin Dashboard
              </Button>
            )}
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summary.map((metric, i) => {
            const Icon = iconMap[metric.icon]
            return (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 card-shadow hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 metric-value mb-1">
                      {metric.value}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                        metric.changeType === 'positive' ? 'text-green-600' :
                        metric.changeType === 'negative' ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {metric.changeType === 'positive' && <ArrowUpRight className="h-3 w-3" />}
                        {metric.changeType === 'negative' && <ArrowDownRight className="h-3 w-3" />}
                        {metric.change}
                      </span>
                      <span className="text-xs text-slate-500">{metric.description}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    {Icon && <Icon className={`h-6 w-6 ${metric.iconColor}`} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-xl border border-slate-200 card-shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Earnings Overview</h3>
                <p className="text-sm text-slate-600">Monthly commission earnings</p>
              </div>
              <select
                value={period}
                onChange={e => setPeriod(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>This year</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="h-80 flex items-center justify-center">
              <EarningsOverviewChart data={chartData} config={chartConfig} />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Referrals */}
          <div className="bg-white rounded-xl border border-slate-200 card-shadow">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Pending Referrals</h3>
                  <p className="text-sm text-slate-600">Awaiting processing</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                </Button>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {pendingReferrals.map((referral, i) => (
                <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">{referral.client}</p>
                      <p className="text-sm text-slate-600">{referral.company}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${referral.statusColor}`}>
                      {referral.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{referral.date}</span>
                    <span className="font-semibold text-slate-900">{referral.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-slate-200 card-shadow">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Recent Payments</h3>
                  <p className="text-sm text-slate-600">Commission payouts</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Payment History
                </Button>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {recentPayments.map((payment, i) => (
                <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${payment.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm font-semibold text-white">{payment.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{payment.company}</p>
                      <p className="text-sm text-slate-600">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{payment.amount}</p>
                      <p className="text-xs text-green-600 font-medium">{payment.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-2">Ready to grow your earnings?</h3>
              <p className="text-blue-100">
                Refer clients to our strategic partners and start earning commissions today.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 whitespace-nowrap"
            >
              Make a Referral
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 py-6 border-t border-slate-200">
          © 2025 Miliare Referral Network. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
