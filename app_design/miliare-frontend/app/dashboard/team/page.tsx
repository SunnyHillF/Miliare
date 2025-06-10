import { team } from '@/lib/team'

export default function TeamPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Our Team</h1>
      <p className="text-gray-500 mb-8">Meet the people behind Miliare.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map(member => (
          <div key={member.email} className="bg-white rounded-xl p-6 shadow border">
            <div className="font-semibold text-lg">{member.name}</div>
            <div className="text-primary font-medium mb-2">{member.title}</div>
            <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
            <a href={`mailto:${member.email}`} className="text-primary hover:underline text-sm">
              {member.email}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
