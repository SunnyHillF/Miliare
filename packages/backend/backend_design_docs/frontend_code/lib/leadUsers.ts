export interface LeadUser {
  id: string
  name: string
  email: string
}

export const leadUsers: LeadUser[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
]
