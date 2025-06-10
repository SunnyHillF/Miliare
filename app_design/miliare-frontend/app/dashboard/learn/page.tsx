'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PartnerDetail } from '@/lib/partnerDetails';

export default function LearnPage() {
  const [partners, setPartners] = useState<PartnerDetail[]>([]);

  useEffect(() => {
    import('@/lib/partnerDetails').then(mod => setPartners(mod.partners));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Learn About Our Partners</h1>
      <p className="text-gray-500 mb-8">Discover our strategic partners and how to effectively refer clients.</p>
      <div className="bg-white rounded-xl p-8 shadow mb-8">
        <div className="text-primary font-semibold mb-2">FEATURED RESOURCE</div>
        <div className="text-xl font-bold mb-2">Complete Guide to Successful Referrals</div>
        <div className="mb-4 text-gray-600">Learn how to identify the right opportunities, position our partners&#39; services effectively, and maximize your commissions.</div>
        <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded">Download Guide</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partners.map(partner => (
          <div key={partner.slug} className="bg-white rounded-xl p-6 shadow border">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 rounded-full p-2" />
              <span className="font-semibold">{partner.name}</span>
            </div>
            <div className="text-gray-600 mb-2 text-sm">{partner.description}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {partner.services.slice(0,3).map((service, idx) => (
                <span key={idx} className="bg-gray-100 rounded px-2 py-1 text-xs">
                  {service}
                </span>
              ))}
            </div>
            <Link href={`/dashboard/learn/${partner.slug}`} className="text-primary hover:underline text-sm font-semibold">Learn more</Link>
          </div>
        ))}
      </div>
    </div>
  );
} 