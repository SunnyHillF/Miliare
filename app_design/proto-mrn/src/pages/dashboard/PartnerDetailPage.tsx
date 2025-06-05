import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  Video, 
  Send, 
  CircleDollarSign, 
  BadgePercent, 
  CreditCard,
  Link2 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { partnersData } from '../../data/partnersData';
import { toast } from '../../components/ui/Toaster';

const PartnerDetailPage = () => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  
  const partner = useMemo(() => {
    return partnersData.find(p => p.id === partnerId);
  }, [partnerId]);
  
  // If partner not found, redirect to Learn page
  if (!partner) {
    navigate('/dashboard/learn');
    return null;
  }
  
  // Mock training resources
  const trainingResources = [
    { 
      id: 1, 
      title: 'Getting Started Guide', 
      type: 'document', 
      icon: <FileText className="h-4 w-4" />,
      duration: '10 min read'
    },
    { 
      id: 2, 
      title: 'Introduction to Services', 
      type: 'video', 
      icon: <Video className="h-4 w-4" />,
      duration: '5:30'
    },
    { 
      id: 3, 
      title: 'How to Position Services', 
      type: 'document', 
      icon: <FileText className="h-4 w-4" />,
      duration: '15 min read'
    },
    { 
      id: 4, 
      title: 'Advanced Referral Strategy', 
      type: 'video', 
      icon: <Video className="h-4 w-4" />,
      duration: '12:45'
    },
  ];
  
  // Mock FAQ items
  const faqItems = [
    {
      question: 'What services does this partner provide?',
      answer: `${partner.name} provides ${partner.tags.join(', ')} services. ${partner.description}`
    },
    {
      question: 'How are commissions calculated?',
      answer: 'Commissions are calculated based on the specific service purchased by the referred client and are typically paid monthly. Refer to the commission structure above for more details.'
    },
    {
      question: 'How long does it take to process a referral?',
      answer: 'Most referrals are processed within 1-2 business days. You will receive an email notification when your referral has been received and when it has been contacted.'
    },
    {
      question: 'When are commissions paid out?',
      answer: 'Commissions are paid on a monthly basis. Any commissions earned during the month will be paid out by the 15th of the following month via direct deposit.'
    },
  ];
  
  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard/learn')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
          <p className="text-sm text-gray-500">
            {partner.tags.join(' • ')}
          </p>
        </div>
      </div>
      
      {/* Partner overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 flex items-center justify-center p-8 bg-gray-50 md:w-64">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: partner.bgColor || '#f3f4f6' }}
            >
              {React.cloneElement(partner.icon as React.ReactElement, { size: 48 })}
            </div>
          </div>
          
          <div className="p-8 flex-1">
            <h2 className="text-xl font-semibold text-gray-900">About {partner.name}</h2>
            <p className="mt-4 text-gray-600">
              {partner.fullDescription || partner.description}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {partner.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href={partner.websiteUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" className="w-full sm:w-auto flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </a>
              
              <a 
                href={partner.referralUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="w-full sm:w-auto flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  Refer a Client
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Commission information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Commission Structure</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <BadgePercent className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-lg font-medium">Commission Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {partner.commissionInfo?.rate || '15-20%'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Of the service value
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <CircleDollarSign className="h-6 w-6 text-success mr-2" />
              <h3 className="text-lg font-medium">Average Payout</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {partner.commissionInfo?.average || '$500-$1,200'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Per successful referral
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium">Payment Schedule</h3>
            </div>
            <p className="text-xl font-bold text-gray-900">Monthly</p>
            <p className="mt-2 text-sm text-gray-500">
              Payments processed by the 15th of each month
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/r/${partner.id}`);
              toast.success("Referral link copied!", "You can now share this with your clients.");
            }}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Copy Your Unique Referral Link
          </Button>
        </div>
      </div>
      
      {/* Training resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Training Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingResources.map((resource) => (
            <div 
              key={resource.id} 
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    resource.type === 'video' ? 'bg-red-100' : 'bg-blue-100'
                  }`}
                >
                  {resource.icon}
                </div>
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
                <p className="text-xs text-gray-500">
                  {resource.type === 'video' ? 'Video' : 'Document'} • {resource.duration}
                </p>
              </div>
              
              <div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-5">
              <button className="text-left w-full flex justify-between items-start">
                <h3 className="text-base font-medium text-gray-900">{item.question}</h3>
                {/* We could add an expand/collapse button here if needed */}
              </button>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-primary rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8 md:p-8 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Ready to start referring?</h2>
            <p className="mt-1 text-primary-foreground text-opacity-90">
              Start earning commissions by referring clients to {partner.name}.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <a 
              href={partner.referralUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="outline" className="w-full md:w-auto bg-white text-primary hover:bg-gray-100">
                Make a Referral Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailPage;