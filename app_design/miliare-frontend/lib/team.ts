export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  email: string;
}

export const team: TeamMember[] = [
  {
    name: 'John Doe',
    title: 'Chief Executive Officer',
    bio: 'John oversees strategic direction and operations at Miliare.',
    email: 'john.doe@example.com',
  },
  {
    name: 'Jane Smith',
    title: 'Chief Technology Officer',
    bio: 'Jane leads our technology strategy and product development.',
    email: 'jane.smith@example.com',
  },
  {
    name: 'Alex Johnson',
    title: 'Head of Operations',
    bio: 'Alex ensures smooth day-to-day operations across the company.',
    email: 'alex.johnson@example.com',
  },
];
