'use client'
import { useEffect, useState } from 'react'
import PaymentTable, { Payment } from '@/components/PaymentTable'

export default function PaymentHistoryPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    import('@/lib/paymentData').then(mod => setPayments(mod.allPayments))
  }, [])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium" htmlFor="from">From</label>
          <input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium" htmlFor="to">To</label>
          <input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1" />
        </div>
      </div>
      <PaymentTable payments={payments} />
    </div>
  )
}
