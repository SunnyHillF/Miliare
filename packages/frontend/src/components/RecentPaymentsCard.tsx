import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from './ui/Button';

export type RecentPayment = {
  id: number;
  date: string;
  amount: number;
  status: string;
  company: string;
};

interface RecentPaymentsCardProps {
  payments: RecentPayment[];
  onViewHistory?: () => void;
}

const RecentPaymentsCard: React.FC<RecentPaymentsCardProps> = ({ 
  payments, 
  onViewHistory 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
        <Button variant="outline" size="sm" onClick={onViewHistory}>
          Payment History
        </Button>
      </div>
      
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{payment.company}</p>
              <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm font-semibold text-gray-900">${payment.amount.toLocaleString()}</p>
              <p className="text-xs font-medium text-green-600">{payment.status}</p>
            </div>
          </div>
        ))}
      </div>
      
      {payments.length === 0 && (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No recent payments</p>
        </div>
      )}
    </div>
  );
};

export default RecentPaymentsCard; 