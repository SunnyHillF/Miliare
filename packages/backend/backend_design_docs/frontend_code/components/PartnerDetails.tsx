import Link from 'next/link'
import type { Partner } from '@/lib/partners'

export default function PartnerDetails({ partner }: { partner: Partner }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h1 className="text-2xl font-bold">{partner.name}</h1>
      <p className="text-gray-600">{partner.description}</p>
      <div>
        <h2 className="font-semibold mb-2">Training Resources</h2>
        <ul className="list-disc list-inside space-y-1">
          {partner.trainingLinks.map((t) => (
            <li key={t.label}>
              <Link href={t.url} className="text-primary hover:underline">
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-1 text-sm">
        <div>
          <span className="font-medium">Compensation:</span> {partner.payout}
        </div>
        <div>
          <span className="font-medium">Website:</span>{' '}
          <Link href={partner.website} className="text-primary hover:underline">
            {partner.website}
          </Link>
        </div>
        <div>
          <span className="font-medium">Contact:</span>{' '}
          <a href={`mailto:${partner.contactEmail}`} className="text-primary hover:underline">
            {partner.contactEmail}
          </a>
        </div>
      </div>
    </div>
  )
}
