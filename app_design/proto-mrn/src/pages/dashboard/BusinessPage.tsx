import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  CreditCard,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const BusinessPage = () => {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const totalEarnings = 14250.75;
  const pendingCommissions = 2430.50;
  const referralsCount = 35;
  const successfulReferrals = 28;
  
  const recentPayments = [
    { id: 1, date: '2023-06-15', amount: 1250.50, status: 'Paid', company: 'Sunny Hill Financial' },
    { id: 2, date: '2023-05-20', amount: 945.25, status: 'Paid', company: 'Prime Corporate Services' },
    { id: 3, date: '2023-04-10', amount: 1750.00, status: 'Paid', company: 'ANCO Insurance' },
    { id: 4, date: '2023-03-05', amount: 830.00, status: 'Paid', company: 'Summit Business Syndicate' },
  ];
  
  const pendingReferrals = [
    { id: 1, date: '2023-06-28', client: 'John Smith', company: 'Prime Corporate Services', status: 'In Progress', estimatedCommission: 850.00 },
    { id: 2, date: '2023-06-25', client: 'Sarah Johnson', company: 'Sunny Hill Financial', status: 'In Progress', estimatedCommission: 1280.50 },
    { id: 3, date: '2023-06-20', client: 'Michael Brown', company: 'Impact Health Sharing', status: 'In Review', estimatedCommission: 300.00 },
  ];
  
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
      
      {/* Chart/Graph placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
          <div>
            <select className="py-1 px-3 border border-gray-300 rounded-md text-sm">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>Year to date</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Earnings visualization will appear here</p>
          </div>
        </div>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        referral.status === 'In Progress' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${referral.estimatedCommission.toLocaleString()}
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
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{payment.company}</p>
                  <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">${payment.amount.toLocaleString()}</p>
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