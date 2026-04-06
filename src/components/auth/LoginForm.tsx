/**
 * LoginForm — Zod-validated login with react-hook-form.
 *
 * Security: dispatches resetAppState() before login so any
 * leftover cache from a previous session is wiped before
 * the new user's session begins. This is defence-in-depth —
 * the primary fix is in authApi logout — but this handles the
 * edge case where a user navigates directly to /auth/login.
 */
'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { extractErrorMessage } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@services/api/authApi';
import { resetAppState } from '@store/actions/resetAppState';
import { useAppDispatch } from '@store/hooks';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const [showPass, setShowPass] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    // Wipe any stale cache from a previous session before logging in
    dispatch(resetAppState());

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
        <h2 className="font-display text-3xl mb-2 text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground">
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
            id="email" type="email" placeholder="you@company.com"
            autoComplete="email" autoFocus
            {...register('email')} error={errors.email?.message}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-xs text-muted-foreground hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password" type={showPass ? 'text' : 'password'}
            placeholder="••••••••" autoComplete="current-password"
            suffix={
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="p-1 rounded transition-colors text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('password')} error={errors.password?.message}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? <Loader2 size={16} className="animate-spin" />
            : <><span>Sign in</span><ArrowRight size={16} className="ml-2" /></>
          }
        </Button>
      </form>

      {/* Demo credentials */}
      <div className="mt-6 p-3 rounded-lg text-xs space-y-1 bg-surface-2 text-muted-foreground">
        <p className="font-mono">admin@example.com / Admin@123456</p>
        <p className="font-mono">user@example.com  / User@123456</p>
      </div>
    </div>
  );
}
