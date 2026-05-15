import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/shared/components/ui';
import { useRegister } from '../hooks/useRegister';
import { RegisterData } from '../types';
import { registerSchema } from '@/lib/validators/auth.validator';
import { extractErrorMessage } from '@/services/api/handlers';
import { AuthLayout } from '../components/AuthLayout';
import { FormError } from '../components/FormError';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const { mutate: registerUser, isPending, error } = useRegister();
  const errorMessage = error
    ? extractErrorMessage(error, 'Registration failed. Please try again.')
    : null;

  const password = watch('password') ?? '';
  const strength = scorePassword(password);

  const onSubmit = (data: RegisterData) => registerUser(data);

  return (
    <AuthLayout
      title="Create your Velora account"
      subtitle="Start your workspace in under a minute. No credit card required."
      brandHeadline="Ship work, not Slack threads."
      brandTagline="Workspaces, projects, sprints and real-time tasks — designed so your team feels less busy and more productive."
      brandBullets={[
        'Unlimited workspaces on the free plan',
        'Live collaboration over Socket.io',
        'Role-based access from day one',
      ]}
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary transition-colors hover:text-primary-400"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-default-500 transition-colors hover:text-foreground focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
          />
          <StrengthMeter score={strength.score} label={strength.label} />
        </div>

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Re-enter password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <FormError message={errorMessage} />

        <Button type="submit" variant="primary" size="lg" loading={isPending} fullWidth>
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-center text-xs leading-relaxed text-default-500">
          By creating an account you agree to Velora&apos;s{' '}
          <a className="text-foreground/80 underline-offset-2 hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a className="text-foreground/80 underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthLayout>
  );
}

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[@$!%*?&]/.test(pw)) score++;
  const labels = ['Too short', 'Weak', 'Okay', 'Good', 'Strong', 'Excellent'];
  return { score, label: labels[score] ?? '' };
}

function StrengthMeter({ score, label }: { score: number; label: string }) {
  const segments = 5;
  const colorFor = (idx: number) => {
    if (idx >= score) return 'bg-content2';
    if (score <= 1) return 'bg-danger';
    if (score === 2) return 'bg-warning';
    if (score === 3) return 'bg-primary-300';
    return 'bg-success';
  };
  return (
    <div className="space-y-1">
      <div className="flex gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${colorFor(i)}`}
          />
        ))}
      </div>
      <div className="text-xs text-default-500">{label}</div>
    </div>
  );
}

function Eye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M3 3l18 18M10.58 10.58a2 2 0 1 0 2.83 2.83M9.88 5.09A10.94 10.94 0 0 1 12 4.5c6 0 9.75 7.5 9.75 7.5a17.6 17.6 0 0 1-3.27 4.27M6.6 6.6A17.5 17.5 0 0 0 2.25 12s3.75 7.5 9.75 7.5a10.7 10.7 0 0 0 4.62-1.04"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
