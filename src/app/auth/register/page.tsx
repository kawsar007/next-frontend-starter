import { RegisterForm } from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';
import { Suspense } from 'react';

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
