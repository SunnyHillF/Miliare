import React from 'react';
import { 
  Building2, 
  BadgeCheck, 
  Landmark, 
  Wallet, 
  HeartPulse, 
  DollarSign, 
  Briefcase,
  Users
} from 'lucide-react';

export type Partner = {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  icon: React.ReactNode;
  tags: string[];
  bgColor?: string;
  websiteUrl?: string;
  referralUrl: string;
  hasTraining?: boolean;
  hasDocumentation?: boolean;
  commissionInfo?: {
    rate: string;
    average: string;
  };
};

export const partnersData: Partner[] = [
  {
    id: 'sunny-hill',
    name: 'Sunny Hill Financial',
    description: 'Financial planning and investment services for individuals and businesses.',
    fullDescription: 'Sunny Hill Financial provides comprehensive financial planning and investment services tailored to the unique needs of both individuals and businesses. With a focus on long-term wealth building and security, they offer retirement planning, investment management, insurance solutions, and more.',
    icon: <DollarSign className="h-6 w-6 text-blue-600" />,
    tags: ['Financial Planning', 'Investment', 'Retirement'],
    bgColor: '#dbeafe',
    websiteUrl: 'https://sunnyhillfinancial.com',
    referralUrl: 'https://sunnyhillfinancial.com/refer',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: {
      rate: '15%',
      average: '$850'
    }
  },
  {
    id: 'prime',
    name: 'Prime Corporate Services',
    description: 'Business entity formation, CPA, tax preparation, bookkeeping, estate planning, and corporate credit services.',
    fullDescription: 'Prime Corporate Services specializes in comprehensive business solutions including entity formation, tax preparation, bookkeeping, estate planning, and corporate credit. Their team of experienced CPAs and business consultants help businesses structure themselves optimally for success and compliance.',
    icon: <Briefcase className="h-6 w-6 text-green-600" />,
    tags: ['Business Services', 'Tax', 'Bookkeeping', 'Estate Planning'],
    bgColor: '#dcfce7',
    websiteUrl: 'https://www.primecorporateservices.com',
    referralUrl: 'https://www.primecorporateservices.com/refer',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: {
      rate: '20%',
      average: '$1,200'
    }
  },
  {
    id: 'anco',
    name: 'ANCO Insurance',
    description: 'Employee benefits, business, and personal insurance solutions for Texas and all 50 states.',
    fullDescription: 'ANCO Insurance provides comprehensive insurance solutions for both businesses and individuals. Their offerings include employee benefits packages, business insurance protection, and personal insurance coverage across all 50 states with specialized expertise in the Texas market.',
    icon: <BadgeCheck className="h-6 w-6 text-red-600" />,
    tags: ['Insurance', 'Employee Benefits', 'Business Insurance'],
    bgColor: '#fee2e2',
    websiteUrl: 'https://www.anco.com',
    referralUrl: 'https://www.anco.com/refer',
    hasTraining: true,
    hasDocumentation: false,
    commissionInfo: {
      rate: '20%',
      average: '$950'
    }
  },
  {
    id: 'weightless',
    name: 'Weightless Financial',
    description: 'Debt resolution services that help clients recognize and overcome financial illiteracy and debt challenges.',
    fullDescription: 'Weightless Financial is dedicated to helping clients overcome debt challenges through effective debt resolution services. They take a holistic approach by addressing financial literacy, helping clients understand their relationship with money, and implementing practical strategies to become debt-free.',
    icon: <Wallet className="h-6 w-6 text-purple-600" />,
    tags: ['Debt Resolution', 'Financial Education', 'Credit Repair'],
    bgColor: '#f3e8ff',
    websiteUrl: 'https://weightlessfinancial.com',
    referralUrl: 'https://weightlessfinancial.com/refer',
    hasTraining: false,
    hasDocumentation: true,
    commissionInfo: {
      rate: 'Variable',
      average: '$500'
    }
  },
  {
    id: 'summit',
    name: 'Summit Business Syndicate',
    description: '401k establishment and management services for companies of all sizes.',
    fullDescription: 'Summit Business Syndicate specializes in establishing and managing 401k retirement plans for businesses of all sizes. Their tailored approach helps companies provide valuable retirement benefits to employees while navigating the complex regulatory environment surrounding retirement plans.',
    icon: <Landmark className="h-6 w-6 text-yellow-600" />,
    tags: ['401k', 'Retirement Plans', 'Employee Benefits'],
    bgColor: '#fef3c7',
    websiteUrl: '',
    referralUrl: '/dashboard/refer/summit',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: {
      rate: '25%',
      average: '$1,500'
    }
  },
  {
    id: 'wellness',
    name: 'Wellness for the Workforce',
    description: 'Helping companies close the gap in healthcare in care, coverage, and cost.',
    fullDescription: 'Wellness for the Workforce is dedicated to helping businesses provide comprehensive healthcare solutions for their employees. They focus on closing gaps in care, coverage, and cost by implementing innovative wellness programs and healthcare solutions tailored to each company\'s unique needs.',
    icon: <Users className="h-6 w-6 text-indigo-600" />,
    tags: ['Healthcare', 'Wellness Programs', 'Employee Benefits'],
    bgColor: '#e0e7ff',
    websiteUrl: 'https://wellnessfortheworkforce.com',
    referralUrl: 'https://wellnessfortheworkforce.com/refer',
    hasTraining: false,
    hasDocumentation: false,
    commissionInfo: {
      rate: 'Direct Payment',
      average: 'Varies'
    }
  },
  {
    id: 'impact',
    name: 'Impact Health Sharing',
    description: 'Affordable alternative to traditional healthcare for independent contractors and individuals without coverage.',
    fullDescription: 'Impact Health Sharing provides an affordable alternative to traditional healthcare insurance through their health sharing community. Especially beneficial for independent contractors and individuals without employer coverage, their programs help members share medical expenses while maintaining quality care options.',
    icon: <HeartPulse className="h-6 w-6 text-pink-600" />,
    tags: ['Health Sharing', 'Healthcare Alternative', 'Medical Cost Sharing'],
    bgColor: '#fce7f3',
    websiteUrl: 'https://www.impacthealthsharing.com',
    referralUrl: 'https://www.impacthealthsharing.com/refer',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: {
      rate: 'TBD',
      average: 'TBD'
    }
  }
];