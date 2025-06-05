import { notFound } from 'next/navigation'
import type { PartnerDetail } from '@/lib/partnerDetails'

// Partner data is dynamically loaded to reduce bundle size
const partnersPromise = import('@/lib/partnerDetails').then(mod => mod.partners)

interface PageProps {
  params: Promise<{ partnerSlug: string }>;
}

export default async function PartnerDetailPage({ params }: PageProps) {
  // Await the params in Next.js 15
  const { partnerSlug } = await params;

  // Load partner data dynamically
  const partners: PartnerDetail[] = await partnersPromise;
  const partner = partners.find(p => p.slug === partnerSlug);
  
  if (!partner) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{partner.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{partner.description}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              💰 {partner.compensation}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {partner.services.map((service, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Training Materials */}
      <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
        <h2 className="text-2xl font-bold mb-6">Training Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partner.materials.map((material, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  {material.type === 'video' && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                  {material.type === 'document' && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  {material.type === 'link' && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{material.title}</h4>
                  <p className="text-sm text-gray-500 capitalize">{material.type}</p>
                </div>
                <a 
                  href={material.url}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Access →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl p-8 shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partner.contact.email && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <a 
                  href={`mailto:${partner.contact.email}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {partner.contact.email}
                </a>
              </div>
            </div>
          )}
          
          {partner.contact.phone && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <a 
                  href={`tel:${partner.contact.phone}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {partner.contact.phone}
                </a>
              </div>
            </div>
          )}
          
          {partner.contact.website && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Website</p>
                <a 
                  href={partner.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
