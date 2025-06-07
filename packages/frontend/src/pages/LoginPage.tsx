import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building, Lock, BarChart, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Pre-fill email if coming from verification page
  const preFilledEmail = (location.state as { email?: string })?.email || '';
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: preFilledEmail,
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login successful', 'Welcome back!');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);
      if ((error as { name?: string }).name === 'UserNotConfirmedException') {
        toast.info('Please verify your email before logging in');
        navigate('/verify', { state: { email: data.email } });
      } else {
        toast.error('Login failed', 'Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Miliare</h1>
            <p className="mt-2 text-gray-600">Sign in to your referral network account</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
              />
              
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </Link>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image/Brand area */}
      <div className="hidden md:block md:w-1/2 bg-primary">
        <div className="h-full flex flex-col justify-center items-center text-white p-16">
          <div className="max-w-md space-y-12">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <BarChart size={48} className="text-primary" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center">Miliare Referral Network</h2>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Strategic Partnerships</h3>
                  <p className="text-white/80 mt-1">Connect with industry-leading financial service providers</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Secure Tracking</h3>
                  <p className="text-white/80 mt-1">Monitor your referrals and commissions in one place</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Rewarding Incentives</h3>
                  <p className="text-white/80 mt-1">Earn competitive commissions for successful referrals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
