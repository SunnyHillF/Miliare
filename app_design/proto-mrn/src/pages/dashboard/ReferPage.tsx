import React, { useState } from 'react';
import { 
  ExternalLink, 
  Send, 
  CircleDollarSign, 
  BadgePercent, 
  Link as LinkIcon 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { partnersData } from '../../data/partnersData';
import { toast } from '../../components/ui/Toaster';

const ReferPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Derive categories from partners data
  const categories = Array.from(
    new Set(partnersData.flatMap(partner => partner.tags))
  );
  
  // Filter partners based on search and category
  const filteredPartners = partnersData.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(search.toLowerCase()) || 
                         partner.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? partner.tags.includes(selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refer Clients</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect your clients with our strategic partners and earn commissions
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/3">
            <Input
              type="search"
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Partners grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: partner.bgColor || '#f3f4f6' }}
                  >
                    {partner.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-gray-500">
                    {partner.tags.join(' • ')}
                  </p>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 line-clamp-3">
                {partner.description}
              </p>
              
              {partner.commissionInfo && (
                <div className="mt-4 bg-gray-50 rounded-md p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <BadgePercent className="h-5 w-5 text-primary mr-1" />
                      <span className="text-sm text-gray-700">{partner.commissionInfo.rate}</span>
                    </div>
                    <div className="flex items-center">
                      <CircleDollarSign className="h-5 w-5 text-success mr-1" />
                      <span className="text-sm text-gray-700">{partner.commissionInfo.average}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/r/${partner.id}`);
                    toast.success("Referral link copied!", "You can now share this with your clients.");
                  }}
                >
                  <LinkIcon className="mr-1 h-4 w-4" />
                  Copy Link
                </Button>
                
                <a 
                  href={partner.referralUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    className="w-full flex items-center justify-center"
                    size="sm"
                  >
                    <Send className="mr-1 h-4 w-4" />
                    Refer Now
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPartners.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No partners found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearch('');
              setSelectedCategory(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      
      {/* Referral tips */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8 text-white">
          <h2 className="text-xl font-bold">Tips for Successful Referrals</h2>
          <p className="mt-2 text-primary-foreground text-opacity-90">
            Maximize your commissions with these best practices
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold">Qualify Your Leads</h3>
              <p className="mt-2 text-sm text-white text-opacity-90">
                Ensure clients have a genuine need for the service before referring.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold">Explain the Value</h3>
              <p className="mt-2 text-sm text-white text-opacity-90">
                Clearly communicate how the service will benefit your client.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold">Follow Up</h3>
              <p className="mt-2 text-sm text-white text-opacity-90">
                Check in with clients after making a referral to ensure satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferPage;