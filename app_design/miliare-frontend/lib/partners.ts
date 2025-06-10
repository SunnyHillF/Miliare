export type Partner = {
  slug: string
  name: string
  description: string
  payout: string
  /**
   * Tags categorize the partner by the services they offer.
   * A partner can have multiple tags which are used for filtering
   * on the dashboard refer page.
   */
  tags: string[]
  trainingLinks: { label: string; url: string }[]
  referralWidgetUrl: string
  contactEmail: string
  website: string
}

export const partners: Partner[] = [
  {
    slug: 'sunny-hill-financial',
    name: 'Sunny Hill Financial',
    description:
      'Financial planning and investment services for individuals and businesses.',
    payout: '20%',
    tags: ['Financial Planning', 'Investment', 'Retirement'],
    trainingLinks: [
      { label: 'Getting Started Video', url: '#' },
      { label: 'Referral Guide PDF', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'info@sunnyhill.example.com',
    website: 'https://sunnyhill.example.com',
  },
  {
    slug: 'prime-corporate-services',
    name: 'Prime Corporate Services',
    description:
      'Business entity formation, CPA, tax preparation, bookkeeping, estate planning, and corporate credit services.',
    payout: '15%',
    tags: ['Business Services', 'Tax', 'Bookkeeping', 'Estate Planning'],
    trainingLinks: [
      { label: 'Partner Overview', url: '#' },
      { label: 'Compensation Structure', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'contact@primecorp.example.com',
    website: 'https://primecorp.example.com',
  },
  {
    slug: 'anco-insurance',
    name: 'ANCO Insurance',
    description:
      'Employee benefits, business, and personal insurance solutions for Texas and all 50 states.',
    payout: '18%',
    tags: ['Insurance', 'Business Insurance', 'Employee Benefits'],
    trainingLinks: [
      { label: 'Agent Training', url: '#' },
      { label: 'Marketing Materials', url: '#' },
    ],
    referralWidgetUrl: '#',
    contactEmail: 'partners@anco.example.com',
    website: 'https://anco.example.com',
  },
]
