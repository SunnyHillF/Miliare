import { graphqlRequest } from './graphqlClient'

export interface Referral {
  id: string
  userId: string
  companyId: string
  clientName: string
  status: string
  amount?: number
  createdAt: string
}

export interface Payment {
  id: string
  referralId: string
  userId: string
  amount: number
  date: string
  status: string
}

export interface DashboardMetrics {
  totalEarnings: number
  pendingCommissions: number
  totalReferrals: number
  successRate: number
}

export interface MonthlyEarning {
  month: string
  earnings: number
}

export interface DashboardDataResponse {
  dashboardMetrics: DashboardMetrics
  referrals: Referral[]
  payments: Payment[]
  earnings6: MonthlyEarning[]
  earnings12: MonthlyEarning[]
}

export async function fetchDashboardData(): Promise<DashboardDataResponse> {
  const query = `query Dashboard {
    dashboardMetrics {
      totalEarnings
      pendingCommissions
      totalReferrals
      successRate
    }
    referrals {
      id
      userId
      companyId
      clientName
      status
      amount
      createdAt
    }
    payments {
      id
      referralId
      userId
      amount
      date
      status
    }
    earnings6: earningsByMonth(months: 6) {
      month
      earnings
    }
    earnings12: earningsByMonth(months: 12) {
      month
      earnings
    }
  }`

  return graphqlRequest<DashboardDataResponse>({
    query,
  })
}

export async function fetchUserPayments(): Promise<Payment[]> {
  const query = `query Payments {
    payments {
      id
      referralId
      userId
      amount
      date
      status
    }
  }`

  const data = await graphqlRequest<{ payments: Payment[] }>({
    query,
  })

  return data.payments
}
