import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Email verification landing.
 *
 * Two states:
 *   - "pending"  : default — user just registered, awaiting click in inbox.
 *   - "resent"   : transient confirmation after they request a new email.
 *
 * The actual token-verification flow (?token=...) is handled by the
 * backend; this page is the post-signup holding screen.
 */
export function EmailVerificationPage() {
  const { user } = useAuth();
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  const email = user?.email;

  const handleResend = async () => {
    setResending(true);
    try {
      // TODO: wire to authApi.resendVerificationEmail once endpoint is finalized.
      await new Promise((r) => setTimeout(r, 600));
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email ? (
          <>
            We sent a verification link to{' '}
            <span className="text-foreground">{email}</span>. Click it to unlock
            your workspace.
          </>
        ) : (
          'Click the verification link in your inbox to unlock your workspace.'
        )
      }
      brandHeadline="One quick step left."
      brandTagline="Verifying your email keeps your team's workspace secure and lets us send you important account alerts."
      brandBullets={[
        'Protects your workspace from impersonation',
        'Enables password recovery if you ever get locked out',
        'Required before inviting teammates',
      ]}
      footer={
        <Link
          to="/login"
          className="font-medium text-primary transition-colors hover:text-primary-400"
        >
          ← Back to sign in
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-6 py-2 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
            <path
              d="M22 12a10 10 0 1 1-3.6-7.7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="m8 12 3 3 9-9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <p className="text-sm leading-relaxed text-default-500">
          The link expires in 24 hours. After verifying, you&apos;ll be
          redirected straight into your dashboard.
        </p>

        <div className="w-full space-y-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            loading={resending}
            onPress={handleResend}
          >
            {resending ? 'Sending…' : resent ? 'Email sent ✓' : 'Resend verification email'}
          </Button>
          <Button
            as={Link}
            to="/dashboard"
            variant="secondary"
            size="lg"
            fullWidth
          >
            I&apos;ll verify later
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
