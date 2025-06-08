import React from 'react';
import { team } from '../../data/teamData';

const TeamPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Our Team</h1>
        <p className="mt-1 text-sm text-gray-500">Meet the people behind Miliare.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map(member => (
          <div key={member.email} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900">{member.name}</h2>
            <p className="text-primary font-medium mb-2">{member.title}</p>
            <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
            <a href={`mailto:${member.email}`} className="text-primary hover:underline text-sm">
              {member.email}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
