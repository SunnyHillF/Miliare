import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toaster';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { Link, useNavigate } from 'react-router-dom';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailForm = z.infer<typeof emailSchema>;

const resetSchema = z.object({
  code: z.string().min(1, 'Verification code is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol (!@#$%^&*)'),
});

type ResetForm = z.infer<typeof resetSchema>;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<ResetForm>({ resolver: zodResolver(resetSchema) });

  const submitEmail = async (data: EmailForm) => {
    try {
      await resetPassword({ username: data.email });
      toast.success('Code sent', 'Check your email for the verification code');
      setEmail(data.email);
      setStep('confirm');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Unable to reset password');
    }
  };

  const submitReset = async (data: ResetForm) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });
      toast.success('Password reset', 'You can now sign in with your new password');
      navigate('/login');
    } catch (error) {
      console.error('Confirm reset error:', error);
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Reset Password</h1>
        <p className="mt-2 text-center text-gray-600">
          {step === 'request'
            ? 'Enter your account email to receive a verification code'
            : 'Enter the code sent to your email and your new password'}
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 'request' ? (
            <form onSubmit={handleEmailSubmit(submitEmail)} className="space-y-6">
              <Input label="Email" {...registerEmail('email')} error={emailErrors.email?.message} />
              <Button type="submit" className="w-full">
                Send Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit(submitReset)} className="space-y-6">
              <Input label="Verification Code" {...registerReset('code')} error={resetErrors.code?.message} />
              <Input
                label="New Password"
                type="password"
                autoComplete="new-password"
                {...registerReset('newPassword')}
                error={resetErrors.newPassword?.message}
              />
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          )}
          {step === 'confirm' && (
            <p className="mt-4 text-center text-sm text-gray-600">
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Back to login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
