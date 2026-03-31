'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRegisterMutation } from '@services/api/authApi';
import { extractErrorMessage } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

const registerSchema = z.object({
  email:     z.string().email('Enter a valid email'),
  username:  z.string().min(3, 'Min 3 chars').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only'),
  firstName: z.string().max(100).optional(),
  lastName:  z.string().max(100).optional(),
  password:  z.string()
    .min(8, 'Min 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must include uppercase, lowercase, number, special char'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const { register: reg, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterValues) => {
    const { confirmPassword, ...payload } = values;
    try {
      await register(payload).unwrap();
      toast.success('Account created! Please sign in.');
      router.push('/auth/login');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'hsl(38 92% 58%)' }}>
          <span className="font-display text-sm font-bold" style={{ color: 'hsl(220 16% 8%)' }}>E</span>
        </div>
        <span className="font-display text-lg" style={{ color: 'hsl(40 15% 90%)' }}>Enterprise</span>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-3xl mb-2" style={{ color: 'hsl(40 15% 90%)' }}>Create account</h2>
        <p className="text-sm" style={{ color: 'hsl(220 10% 55%)' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline underline-offset-4">Sign in</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="Jane" autoFocus {...reg('firstName')} error={errors.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Doe" {...reg('lastName')} error={errors.lastName?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" autoComplete="email"
            {...reg('email')} error={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="jane_doe" autoComplete="username"
            {...reg('username')} error={errors.username?.message} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
            autoComplete="new-password"
            suffix={
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="p-1 rounded transition-colors" style={{ color: 'hsl(220 10% 55%)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...reg('password')} error={errors.password?.message}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type={showPass ? 'text' : 'password'} placeholder="••••••••"
            autoComplete="new-password"
            {...reg('confirmPassword')} error={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Create account <ArrowRight size={16} className="ml-2" /></>}
        </Button>
      </form>
    </div>
  );
}
