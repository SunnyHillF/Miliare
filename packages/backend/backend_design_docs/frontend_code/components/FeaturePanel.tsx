'use client';
import { useEffect, useState } from 'react';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Award, 
  Clock, 
  DollarSign,
  Target,
  BarChart3,
  FileText,
  Globe
} from 'lucide-react';
import type { Feature } from '@/lib/features';

// Create a mapping for the specific icons we use
const iconMap: Record<string, any> = {
  Shield,
  TrendingUp,
  Users,
  Award,
  Clock,
  DollarSign,
  Target,
  BarChart3,
  FileText,
  Globe
};

export default function FeaturePanel() {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    import('@/lib/features').then(mod => setFeatures(mod.features));
  }, []);

  return (
    <ul className="space-y-6 w-full">
      {features.map((f, idx) => {
        const Icon = iconMap[f.icon];
        return (
          <li key={idx} className="flex items-start space-x-4">
            <span className="mt-1">
              {Icon ? <Icon className="w-5 h-5" /> : null}
            </span>
            <div>
              <div className="font-semibold">{f.title}</div>
              <div className="text-sm text-white/80 md:text-gray-600 md:text-inherit">
                {f.description}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
