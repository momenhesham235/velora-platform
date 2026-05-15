import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/shared/components/ui';
import { ForgotPasswordData } from '../types';
import { forgotPasswordSchema } from '@/lib/validators/auth.validator';
import { AuthLayout } from '../components/AuthLayout';
import { FormError } from '../components/FormError';

export function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      setServerError(null);
      // TODO: wire to authApi.forgotPassword once endpoint is finalized.
      await new Promise((r) => setTimeout(r, 600));
      setSubmittedEmail(data.email);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  if (submittedEmail) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle={
          <>
            We sent a reset link to{' '}
            <span className="text-foreground">{submittedEmail}</span>. It will
            expire in 30 minutes.
          </>
        }
        footer={
          <Link
            to="/login"
            className="font-medium text-primary transition-colors hover:text-primary-400"
          >
            ← Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
              <path
                d="M3 7.5 12 13l9-5.5M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-sm leading-relaxed text-default-500">
            Didn&apos;t get an email? Check your spam folder, or{' '}
            <button
              type="button"
              onClick={() => setSubmittedEmail(null)}
              className="font-medium text-primary transition-colors hover:text-primary-400"
            >
              try a different address
            </button>
            .
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email tied to your Velora account and we'll send you a reset link."
      footer={
        <Link
          to="/login"
          className="font-medium text-primary transition-colors hover:text-primary-400"
        >
          ← Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <FormError message={serverError} />

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} fullWidth>
          {isSubmitting ? 'Sending link…' : 'Send reset link'}
        </Button>
      </form>
    </AuthLayout>
  );
}
