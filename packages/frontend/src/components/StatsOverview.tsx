import React from 'react';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
} from 'lucide-react';

export type StatItem = {
  label: string;
  value: string;
  icon: 'DollarSign' | 'Clock' | 'Users' | 'TrendingUp';
  bgColor: string;
  iconColor: string;
};

interface StatsOverviewProps {
  stats: StatItem[];
}

const iconMap = {
  DollarSign,
  Clock,
  Users,
  TrendingUp,
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon];
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor} ${stat.iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview; 