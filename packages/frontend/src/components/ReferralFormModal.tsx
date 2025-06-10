import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toaster';

const referralSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  type: z.string().min(1, 'Referral type is required'),
  value: z.string().min(1, 'Referral value is required'),
});

type ReferralFormValues = z.infer<typeof referralSchema>;

interface ReferralFormModalProps {
  open: boolean;
  onClose: () => void;
  partnerName?: string;
}

const ReferralFormModal: React.FC<ReferralFormModalProps> = ({ open, onClose, partnerName }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReferralFormValues>({
    resolver: zodResolver(referralSchema),
  });

  const onSubmit = async (formData: ReferralFormValues) => {
    try {

      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const response = await fetch(
        'https://hooks.zapier.com/hooks/catch/16444537/uydvaog/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );


      if (!response.ok) {
        throw new Error('Request failed');
      }

      toast.success('Referral submitted', `Thank you for referring ${formData.name}.`);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to submit referral', error);

      toast.success(
        'Referral submitted',
        `Thank you for referring ${formData.name}.`
      );
      reset();
      onClose();
    } catch (err) {
      console.error('Failed to send referral', err);

      toast.error('Submission failed', 'Please try again later.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={partnerName ? `Refer to ${partnerName}` : 'New Referral'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
        <Input label="Type of Referral" {...register('type')} error={errors.type?.message} />
        <Input label="Value of Referral" type="number" {...register('value')} error={errors.value?.message} />
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReferralFormModal;
