import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter your full address'),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please enter your state'),
  zipCode: z.string().min(5, 'Please enter a valid ZIP code'),
  company: z.string().min(1, 'Please select your company'),
  uplineEVC: z.string().optional(),
  uplineSMD: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const companies = [
  { value: 'WFG', label: 'WFG' },
  { value: 'Sunny Hill Financial', label: 'Sunny Hill Financial' },
  { value: 'Prime Corporate Services', label: 'Prime Corporate Services' },
  { value: 'ANCO', label: 'ANCO' },
  { value: 'Weightless Financial', label: 'Weightless Financial' },
  { value: 'Summit Business Syndicate', label: 'Summit Business Syndicate' },
  { value: 'Wellness for the Workforce', label: 'Wellness for the Workforce' },
  { value: 'Impact Health Sharing', label: 'Impact Health Sharing' },
  { value: 'Other', label: 'Other' },
];

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWFGFields, setShowWFGFields] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      company: '',
      uplineEVC: '',
      uplineSMD: '',
      password: '',
      confirmPassword: '',
    },
  });

  const company = watch('company');

  React.useEffect(() => {
    setShowWFGFields(company === 'WFG');
  }, [company]);

  const totalSteps = 3;
  
  const nextStep = async () => {
    let fieldsToValidate: Array<keyof RegisterFormValues> = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
        break;
      case 2:
        fieldsToValidate = ['company'];
        if (showWFGFields) {
          fieldsToValidate.push('uplineEVC', 'uplineSMD');
        }
        break;
      default:
        break;
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        company: data.company,
        uplineEVC: data.uplineEVC,
        uplineSMD: data.uplineSMD,
        password: data.password,
      });
      
      toast.success('Registration successful', 'Your account has been created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed', 'Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Address"
              {...register('address')}
              error={errors.address?.message}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
              />
              <Input
                label="State"
                {...register('state')}
                error={errors.state?.message}
              />
              <Input
                label="ZIP Code"
                {...register('zipCode')}
                error={errors.zipCode?.message}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Company Affiliation</h2>
            
            <Select
              label="Company"
              {...register('company')}
              options={companies}
              error={errors.company?.message}
            />
            
            {showWFGFields && (
              <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium">WFG Information</h3>
                <Input
                  label="Name of Direct Upline EVC"
                  {...register('uplineEVC')}
                  error={errors.uplineEVC?.message}
                />
                <Input
                  label="Name of Direct Upline SMD"
                  {...register('uplineSMD')}
                  error={errors.uplineSMD?.message}
                />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Create Password</h2>
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            
            <div className="mt-8">
              <h3 className="font-medium mb-4">Next Steps After Registration:</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="text-success mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <p>You'll be redirected to complete a 1099-NEC form for tax purposes</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-success mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <p>You'll need to provide direct deposit information for commission payments</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-success mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <p>Once completed, you'll have full access to the Miliare Referral Network</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Create Your Account</h1>
        <p className="mt-2 text-center text-gray-600">
          Join the Miliare Referral Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white p-8 shadow rounded-lg">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">
                Step {step} of {totalSteps}
              </div>
              <div className="text-sm font-medium text-primary">
                {Math.round((step / totalSteps) * 100)}% Complete
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;