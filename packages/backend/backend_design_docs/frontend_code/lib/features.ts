export interface Feature {
  title: string;
  description: string;
  icon: string; // name of lucide-react icon
}

export const features: Feature[] = [
  {
    title: 'Strategic Partnerships',
    description: 'Connect with industry-leading financial service providers',
    icon: 'Handshake',
  },
  {
    title: 'Secure Tracking',
    description: 'Monitor your referrals and commissions in one place',
    icon: 'ShieldCheck',
  },
  {
    title: 'Rewarding Incentives',
    description: 'Earn competitive commissions for successful referrals',
    icon: 'BadgeDollarSign',
  },
];
