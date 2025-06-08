export interface PartnerDetail {
  slug: string;
  name: string;
  description: string;
  compensation: string;
  services: string[];
  materials: Array<{ title: string; type: 'video' | 'document' | 'link'; url: string }>;
  contact: { email?: string; phone?: string; website?: string };
}

export const partners: PartnerDetail[] = [
  {
    slug: 'sunny-hill-financial',
    name: 'Sunny Hill Financial',
    description:
      'Financial planning and investment services for individuals and businesses. Specializing in retirement planning, wealth management, and investment strategies.',
    compensation: '5-8% commission based on service type',
    services: ['Financial Planning', 'Investment Management', 'Retirement Planning', 'Wealth Management'],
    materials: [
      { title: 'Introduction to Our Services', type: 'video', url: '#' },
      { title: 'Referral Process Guide', type: 'document', url: '#' },
      { title: 'Client Assessment Toolkit', type: 'document', url: '#' },
    ],
    contact: {
      email: 'partners@sunnyhillfinancial.com',
      phone: '(555) 123-4567',
      website: 'https://sunnyhillfinancial.com',
    },
  },
  {
    slug: 'prime-corporate-services',
    name: 'Prime Corporate Services',
    description:
      'Business entity formation, CPA, tax preparation, bookkeeping, estate planning, and corporate credit services.',
    compensation: '10-15% commission on new business formations',
    services: ['Business Formation', 'Tax Preparation', 'Bookkeeping', 'Estate Planning', 'Corporate Credit'],
    materials: [
      { title: 'Business Formation Overview', type: 'video', url: '#' },
      { title: 'Tax Services Brochure', type: 'document', url: '#' },
    ],
    contact: {
      email: 'referrals@primecorporate.com',
      phone: '(555) 987-6543',
      website: 'https://primecorporate.com',
    },
  },
  {
    slug: 'anco-insurance',
    name: 'ANCO Insurance',
    description:
      'Employee benefits, business, and personal insurance solutions for Texas and all 50 states.',
    compensation: '6-12% commission depending on policy type',
    services: ['Employee Benefits', 'Business Insurance', 'Personal Insurance', 'Health Insurance'],
    materials: [
      { title: 'Insurance Products Overview', type: 'video', url: '#' },
      { title: 'Employee Benefits Guide', type: 'document', url: '#' },
      { title: 'Quote Calculator Tool', type: 'link', url: '#' },
    ],
    contact: {
      email: 'agents@ancoinsurance.com',
      phone: '(555) 456-7890',
      website: 'https://ancoinsurance.com',
    },
  },
];
