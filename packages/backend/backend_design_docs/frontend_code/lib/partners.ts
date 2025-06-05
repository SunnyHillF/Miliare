export type Partner = {
  slug: string
  name: string
  description: string
  commissionInfo: { rate: string; average: string }
  trainingLinks: { label: string; url: string }[]
  referralWidgetUrl: string
  contactEmail: string
  website: string
  tags: string[]
}

export const partners: Partner[] = [
  {
    slug: 'sunny-hill-financial',
    name: 'Sunny Hill Financial',
    description:
      'Financial planning and investment services for individuals and businesses.',
    commissionInfo: { rate: '15%', average: '$850' },
    trainingLinks: [
      { label: 'Getting Started Video', url: '#' },
      { label: 'Referral Guide PDF', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'info@sunnyhill.example.com',
    website: 'https://sunnyhill.example.com',
    tags: ['Financial Planning', 'Investment', 'Retirement'],
  },
  {
    slug: 'prime-corporate-services',
    name: 'Prime Corporate Services',
    description:
      'Business entity formation, CPA, tax preparation, bookkeeping, estate planning, and corporate credit services.',
    commissionInfo: { rate: '20%', average: '$1,200' },
    trainingLinks: [
      { label: 'Partner Overview', url: '#' },
      { label: 'Compensation Structure', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'contact@primecorp.example.com',
    website: 'https://primecorp.example.com',
    tags: ['Business Services', 'Tax', 'Bookkeeping', 'Estate Planning'],
  },
  {
    slug: 'anco-insurance',
    name: 'ANCO Insurance',
    description:
      'Employee benefits, business, and personal insurance solutions for Texas and all 50 states.',
    commissionInfo: { rate: '20%', average: '$950' },
    trainingLinks: [
      { label: 'Agent Training', url: '#' },
      { label: 'Marketing Materials', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'partners@anco.example.com',
    website: 'https://anco.example.com',
    tags: ['Insurance', 'Employee Benefits', 'Business Insurance'],
  },
  {
    slug: 'weightless-financial',
    name: 'Weightless Financial',
    description: 'Debt resolution and financial literacy programs.',
    commissionInfo: { rate: 'Variable', average: '$500' },
    trainingLinks: [
      { label: 'Overview', url: '#' },
      { label: 'Referral Process', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'support@weightless.example.com',
    website: 'https://weightlessfinancial.com',
    tags: ['Financial Planning'],
  },
  {
    slug: 'summit-business-syndicate',
    name: 'Summit Business Syndicate',
    description: '401k setup and management services for companies.',
    commissionInfo: { rate: '25%', average: '$1,500' },
    trainingLinks: [
      { label: 'Partner Brief', url: '#' },
      { label: 'Compensation Details', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'info@summit.example.com',
    website: 'https://summitsyndicate.example.com',
    tags: ['Retirement', 'Business Services'],
  },
  {
    slug: 'wellness-for-the-workforce',
    name: 'Wellness for the Workforce',
    description: 'Healthcare gap solutions for employers.',
    commissionInfo: { rate: 'Direct Payment', average: 'Varies' },
    trainingLinks: [
      { label: 'Program Overview', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'hello@wftwf.example.com',
    website: 'https://wellnessfortheworkforce.com',
    tags: ['Employee Benefits'],
  },
  {
    slug: 'impact-health-sharing',
    name: 'Impact Health Sharing',
    description: 'Affordable alternative healthcare options.',
    commissionInfo: { rate: 'TBD', average: 'TBD' },
    trainingLinks: [
      { label: 'Getting Started', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'partners@impacthealth.example.com',
    website: 'https://impacthealthsharing.com',
    tags: ['Insurance', 'Employee Benefits'],
  },
]
