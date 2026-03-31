import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'hsl(var(--background))' }}>
      <div className="w-full max-w-md">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
