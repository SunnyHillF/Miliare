import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toaster';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useAuth } from '../contexts/AuthContext';

const verifySchema = z.object({
  email: z.string().email('Please enter a valid email'),
  code: z.string().min(1, 'Verification code is required'),
});

type VerifyForm = z.infer<typeof verifySchema>;

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const initialEmail = (location.state as { email?: string })?.email || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: initialEmail, code: '' },
  });

  // Clean up temp password on component unmount (if user navigates away)
  useEffect(() => {
    return () => {
      // Only clean up if user is navigating away without completing verification
      const tempPassword = sessionStorage.getItem('tempPassword');
      if (tempPassword && !window.location.pathname.includes('/dashboard')) {
        sessionStorage.removeItem('tempPassword');
      }
    };
  }, []);

  const onSubmit = async (data: VerifyForm) => {
    setIsSubmitting(true);
    try {
      await confirmSignUp({ username: data.email, confirmationCode: data.code });
      
      // Get the temporary password stored during registration
      const tempPassword = sessionStorage.getItem('tempPassword');
      
      if (tempPassword) {
        // Auto-login the user after successful verification
        await login(data.email, tempPassword);
        // Clear the temporary password
        sessionStorage.removeItem('tempPassword');
        toast.success('Email verified!', 'Welcome to Miliare');
        navigate('/dashboard');
      } else {
        // Fallback to login page if no temp password found
        toast.success('Verification successful', 'You can now sign in');
        navigate('/login');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed', 'Invalid code or email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      const email = watch('email');
      await resendSignUpCode({ username: email });
      toast.success('Code resent', 'Check your email for a new code');
    } catch (error) {
      console.error('Resend code error:', error);
      toast.error('Unable to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Verify Your Email</h1>
        <p className="mt-2 text-center text-gray-600">
          {initialEmail ? 'Enter the code sent to your email address' : 'Enter your email and the verification code'}
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label="Email" {...register('email')} error={errors.email?.message} />
            <Input label="Verification Code" {...register('code')} error={errors.code?.message} />
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={resend}>
                Resend Code
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
