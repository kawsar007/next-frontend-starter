/**
 * LoginForm — client component with react-hook-form + Zod validation.
 * Dispatches to RTK Query authApi.login endpoint.
 * Reads `callbackUrl` from search params for post-login redirect.
 */
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useLoginMutation } from '@services/api/authApi';
import { extractErrorMessage } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const callbackUrl   = searchParams.get('callbackUrl') ?? '/dashboard';
  const [showPass, setShowPass] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values).unwrap();
      toast.success('Welcome back!');
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h2 className="font-display text-3xl mb-2" style={{ color: 'hsl(40 15% 90%)' }}>
          Sign in
        </h2>
        <p className="text-sm" style={{ color: 'hsl(220 10% 55%)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
              style={{ color: 'hsl(220 10% 55%)' }}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            suffix={
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="p-1 rounded hover:text-foreground transition-colors"
                style={{ color: 'hsl(220 10% 55%)' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>Sign in <ArrowRight size={16} className="ml-2" /></>
          )}
        </Button>
      </form>

      {/* Demo credentials hint */}
      <div
        className="mt-6 p-3 rounded-lg text-xs space-y-1"
        style={{ background: 'hsl(var(--surface-2))', color: 'hsl(220 10% 55%)' }}
      >
        <p className="font-mono">admin@example.com / Admin@123456</p>
        <p className="font-mono">user@example.com  / User@123456</p>
      </div>
    </div>
  );
}
