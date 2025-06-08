import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  CreditCard,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  summary,
  pendingReferrals,
  recentPayments,
  earningsData6Months,
  earningsData12Months,
  earningsDataYear,
} from '../../data/dashboardData';
import { EarningsOverviewChart } from '../../components/EarningsOverviewChart';

const BusinessPage = () => {
  const [period, setPeriod] = useState('Last 6 months');

  const earningsMap: Record<string, typeof earningsData6Months> = {
    'Last 6 months': earningsData6Months,
    'Last 12 months': earningsData12Months,
    'Year to date': earningsDataYear,
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Business Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your referrals, earnings, and pending commissions
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map(metric => (
          <div key={metric.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${metric.bgColor} ${metric.iconColor}`}>{
                metric.icon === 'DollarSign' ? <DollarSign className="h-6 w-6" /> :
                metric.icon === 'Clock' ? <Clock className="h-6 w-6" /> :
                metric.icon === 'Users' ? <Users className="h-6 w-6" /> :
                <TrendingUp className="h-6 w-6" />
              }</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Earnings chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
          <div>
            <select
              className="py-1 px-3 border border-gray-300 rounded-md text-sm"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>Year to date</option>
            </select>
          </div>
        </div>
        <EarningsOverviewChart data={earningsMap[period]} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Referrals */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Referrals</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Commission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingReferrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(referral.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {referral.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referral.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${referral.statusColor}`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <Button variant="outline" size="sm">Payment History</Button>
          </div>
          
          <div className="space-y-4">
            {recentPayments.map((payment, i) => (
              <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{payment.company}</p>
                  <p className="text-xs text-gray-500">{payment.date}</p>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">{payment.amount}</p>
                  <p className="text-xs font-medium text-green-600">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-primary rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8 md:p-8 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Ready to increase your earnings?</h2>
            <p className="mt-1 text-primary-foreground text-opacity-90">
              Refer clients to our strategic partners and earn commissions.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link to="/dashboard/refer">
              <Button variant="outline" className="w-full md:w-auto bg-white text-primary hover:bg-gray-100">
                Make a Referral
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
