export interface SummaryMetric {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  description: string;
  icon: string;
  gradient: string;
  bgColor: string;
  iconColor: string;
}

export interface PendingReferral {
  date: string;
  client: string;
  company: string;
  status: string;
  amount: string;
  statusColor: string;
}

export interface RecentPayment {
  company: string;
  date: string;
  amount: string;
  status: string;
  initials: string;
  bgColor: string;
}

export interface Earnings { month: string; earnings: number }

export const summary: SummaryMetric[] = [
  {
    label: 'Total Earnings',
    value: '$14,250.75',
    change: '+12.3%',
    changeType: 'positive',
    description: 'vs last month',
    icon: 'DollarSign',
    gradient: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    label: 'Pending Commissions',
    value: '$2,430.50',
    change: '3 pending',
    changeType: 'neutral',
    description: 'awaiting payout',
    icon: 'Clock',
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  {
    label: 'Total Referrals',
    value: '35',
    change: '+8',
    changeType: 'positive',
    description: 'this month',
    icon: 'Users',
    gradient: 'from-green-600 to-green-700',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    label: 'Success Rate',
    value: '80%',
    change: '+5%',
    changeType: 'positive',
    description: 'vs industry avg',
    icon: 'TrendingUp',
    gradient: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
];

export const pendingReferrals: PendingReferral[] = [
  {
    date: 'Jun 27, 2023',
    client: 'John Smith',
    company: 'Prime Corporate Services',
    status: 'In Progress',
    amount: '$1,250',
    statusColor: 'bg-amber-100 text-amber-800'
  },
  {
    date: 'Jun 24, 2023',
    client: 'Sarah Johnson',
    company: 'Sunny Hill Financial',
    status: 'In Progress',
    amount: '$945',
    statusColor: 'bg-amber-100 text-amber-800'
  },
  {
    date: 'Jun 19, 2023',
    client: 'Michael Brown',
    company: 'Impact Health Sharing',
    status: 'In Review',
    amount: '$1,750',
    statusColor: 'bg-blue-100 text-blue-800'
  },
];

export const recentPayments: RecentPayment[] = [
  {
    company: 'Sunny Hill Financial',
    date: 'Jun 14, 2023',
    amount: '$1,250.50',
    status: 'Paid',
    initials: 'SH',
    bgColor: 'bg-blue-600'
  },
  {
    company: 'Prime Corporate Services',
    date: 'May 19, 2023',
    amount: '$945.25',
    status: 'Paid',
    initials: 'PC',
    bgColor: 'bg-green-600'
  },
  {
    company: 'ANCO Insurance',
    date: 'Apr 9, 2023',
    amount: '$1,750.00',
    status: 'Paid',
    initials: 'AN',
    bgColor: 'bg-purple-600'
  },
  {
    company: 'Summit Business Syndicate',
    date: 'Mar 4, 2023',
    amount: '$830.00',
    status: 'Paid',
    initials: 'SB',
    bgColor: 'bg-amber-600'
  },
];

export const earningsData6Months: Earnings[] = [
  { month: 'Jan', earnings: 2000 },
  { month: 'Feb', earnings: 2500 },
  { month: 'Mar', earnings: 3000 },
  { month: 'Apr', earnings: 3500 },
  { month: 'May', earnings: 2800 },
  { month: 'Jun', earnings: 2950 },
];

export const earningsData12Months: Earnings[] = [
  { month: 'Jul', earnings: 3100 },
  { month: 'Aug', earnings: 3300 },
  { month: 'Sep', earnings: 3400 },
  { month: 'Oct', earnings: 3600 },
  { month: 'Nov', earnings: 3700 },
  { month: 'Dec', earnings: 3900 },
  ...earningsData6Months,
].slice(-12);

export const earningsDataYear: Earnings[] = [
  ...earningsData12Months,
];

export const earningsData = earningsData6Months;

export const chartConfig = {
  earnings: {
    label: 'Earnings',
    color: '#1e40af',
  },
};
