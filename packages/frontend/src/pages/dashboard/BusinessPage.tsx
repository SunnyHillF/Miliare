import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import EarningsChart, { EarningsPoint } from '../../components/EarningsChart';
import PendingReferralsCard, { PendingReferral } from '../../components/PendingReferralsCard';
import RecentPaymentsCard, { RecentPayment } from '../../components/RecentPaymentsCard';

const BusinessPage = () => {
  
  // Mock data for demonstration
  const totalEarnings = 14250.75;
  const pendingCommissions = 2430.50;
  const referralsCount = 35;
  const successfulReferrals = 28;
  
  const recentPayments: RecentPayment[] = [
    { id: 1, date: '2023-06-15', amount: 1250.50, status: 'Paid', company: 'Sunny Hill Financial' },
    { id: 2, date: '2023-05-20', amount: 945.25, status: 'Paid', company: 'Prime Corporate Services' },
    { id: 3, date: '2023-04-10', amount: 1750.00, status: 'Paid', company: 'ANCO Insurance' },
    { id: 4, date: '2023-03-05', amount: 830.00, status: 'Paid', company: 'Summit Business Syndicate' },
  ];
  
  const pendingReferrals: PendingReferral[] = [
    { id: 1, date: '2023-06-28', client: 'John Smith', company: 'Prime Corporate Services', status: 'In Progress', estimatedCommission: 850.00 },
    { id: 2, date: '2023-06-25', client: 'Sarah Johnson', company: 'Sunny Hill Financial', status: 'In Progress', estimatedCommission: 1280.50 },
    { id: 3, date: '2023-06-20', client: 'Michael Brown', company: 'Impact Health Sharing', status: 'In Review', estimatedCommission: 300.00 },
  ];

  const earningsData6Months: EarningsPoint[] = [
    { month: 'Jan', earnings: 2000 },
    { month: 'Feb', earnings: 2500 },
    { month: 'Mar', earnings: 3000 },
    { month: 'Apr', earnings: 3500 },
    { month: 'May', earnings: 2800 },
    { month: 'Jun', earnings: 2950 },
  ];

  const earningsData12Months: EarningsPoint[] = [
    { month: 'Jul', earnings: 3100 },
    { month: 'Aug', earnings: 3300 },
    { month: 'Sep', earnings: 3400 },
    { month: 'Oct', earnings: 3600 },
    { month: 'Nov', earnings: 3700 },
    { month: 'Dec', earnings: 3900 },
    ...earningsData6Months,
  ].slice(-12);

  const earningsDataYear: EarningsPoint[] = [...earningsData12Months];

  const [period, setPeriod] = useState('Last 6 months');

  const earningsMap: Record<string, EarningsPoint[]> = {
    'Last 6 months': earningsData6Months,
    'Last 12 months': earningsData12Months,
    'Year to date': earningsDataYear,
  };

  const chartData = earningsMap[period] || earningsData6Months;

  const handleViewAllReferrals = () => {
    console.log('Navigate to all referrals page');
  };

  const handleViewPaymentHistory = () => {
    console.log('Navigate to payment history page');
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">${totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-success">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Commissions</p>
              <p className="text-2xl font-semibold text-gray-900">${pendingCommissions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Referrals</p>
              <p className="text-2xl font-semibold text-gray-900">{referralsCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round((successfulReferrals / referralsCount) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
          <div>
            <select
              className="py-1 px-3 border border-gray-300 rounded-md text-sm"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>Year to date</option>
            </select>
          </div>
        </div>

        <div className="h-64">
          <EarningsChart data={chartData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Referrals Component */}
        <PendingReferralsCard 
          referrals={pendingReferrals}
          onViewAll={handleViewAllReferrals}
        />
        
        {/* Recent Payments Component */}
        <RecentPaymentsCard 
          payments={recentPayments}
          onViewHistory={handleViewPaymentHistory}
        />
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
