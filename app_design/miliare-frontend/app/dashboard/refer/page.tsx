'use client';

import { useState } from 'react';
import Link from 'next/link';
import { partners } from '@/lib/partners';
import { cn } from '@/lib/utils';

const TAGS = [
  'Clear Filter',
  'Financial Planning',
  'Investment',
  'Retirement',
  'Business Services',
  'Tax',
  'Bookkeeping',
  'Estate Planning',
  'Insurance',
  'Employee Benefits',
  'Business Insurance',
];

export default function ReferPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTag = (tag: string) => {
    if (tag === 'Clear Filter') {
      setSelectedTags([]);
      return;
    }

    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      partner.tags.some((t) => selectedTags.includes(t));

    return matchesSearch && matchesTags;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Refer Clients</h1>
      <p className="text-gray-500 mb-8">Connect your clients with our strategic partners and earn commissions</p>

      <div className="bg-white rounded-xl p-6 shadow mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {TAGS.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'px-3 py-1 rounded border text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-50 text-gray-700 hover:bg-primary-light hover:text-primary'
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <input
          className="border rounded px-3 py-2 w-full mb-6"
          placeholder="Search partners"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-4">
          {filteredPartners.map((partner) => (
            <div key={partner.slug} className="bg-white rounded-xl p-6 shadow border">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-50 text-blue-600 rounded-full p-2">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="#E6F0FF"/>
                    <text x="12" y="17" textAnchor="middle" fontSize="14" fill="#1566C0">
                      {partner.name.charAt(0)}
                    </text>
                  </svg>
                </span>
                <span className="font-semibold">{partner.name}</span>
              </div>
              <div className="text-gray-600 mb-2 text-sm">{partner.description}</div>
              <div className="flex gap-4 items-center mb-4">
                <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                  💰 {partner.payout} commission
                </span>
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/dashboard/learn/${partner.slug}`}
                  className="border rounded px-3 py-1 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </Link>
                <Link 
                  href={`/dashboard/refer/${partner.slug}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
                >
                  Refer Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
