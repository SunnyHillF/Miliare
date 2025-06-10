import React from 'react';
import { Button } from './ui/Button';

export type PendingReferral = {
  id: number;
  date: string;
  client: string;
  company: string;
  status: string;
  estimatedCommission: number;
};

interface PendingReferralsCardProps {
  referrals: PendingReferral[];
  onViewAll?: () => void;
}

const PendingReferralsCard: React.FC<PendingReferralsCardProps> = ({ 
  referrals, 
  onViewAll 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Pending Referrals</h2>
        <Button variant="outline" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      
      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {referrals.map((referral) => (
          <div key={referral.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{referral.client}</h3>
                <p className="text-sm text-gray-500">{referral.company}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                referral.status === 'In Progress' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {referral.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{new Date(referral.date).toLocaleDateString()}</span>
              <span className="font-medium text-gray-900">${referral.estimatedCommission.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commission
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referrals.map((referral) => (
              <tr key={referral.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{referral.client}</div>
                    <div className="text-xs text-gray-500">{new Date(referral.date).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {referral.company}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    referral.status === 'In Progress' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {referral.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${referral.estimatedCommission.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingReferralsCard; 