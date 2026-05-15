import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Input } from '@/shared/components/ui';
import { useLogin } from '../hooks/useLogin';
import { LoginCredentials } from '../types';
import { loginSchema } from '@/lib/validators/auth.validator';
import { extractErrorMessage } from '@/services/api/handlers';
import { AuthLayout } from '../components/AuthLayout';
import { FormError } from '../components/FormError';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending, error } = useLogin();
  const errorMessage = error
    ? extractErrorMessage(error, 'Login failed. Please try again.')
    : null;

  const onSubmit = (data: LoginCredentials) => login(data);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue building with your team."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary transition-colors hover:text-primary-400"
          >
            Create one
          </Link>
        </>
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

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
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

        <div className="flex items-center justify-between">
          <Checkbox>Remember me</Checkbox>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-400"
          >
            Forgot password?
          </Link>
        </div>

        <FormError message={errorMessage} />

        <Button type="submit" variant="primary" size="lg" loading={isPending} fullWidth>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>

        <FormDivider label="or" />

        <Button type="button" variant="secondary" size="lg" fullWidth isDisabled>
          Continue with SSO
          <span className="ml-2 rounded-md bg-content2 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-default-500">
            Soon
          </span>
        </Button>
      </form>
    </AuthLayout>
  );
}

function FormDivider({ label }: { label: string }) {
  return (
    <div className="relative my-2">
      <div aria-hidden className="h-px w-full bg-divider" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-content1 px-3 text-xs uppercase tracking-wider text-default-500">
        {label}
      </span>
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
