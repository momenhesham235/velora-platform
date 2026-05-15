import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { BrandMark } from '@/shared/components/branding/BrandMark';
import { Card, Heading, Text } from '@/shared/components/ui';

interface AuthLayoutProps {
  /** Form-column heading (e.g. "Welcome back") */
  title: string;
  /** Form-column subheading shown under the title */
  subtitle?: ReactNode;
  /** Footer row below the form (e.g. "Don't have an account? Sign up") */
  footer?: ReactNode;
  /** Left panel large headline */
  brandHeadline?: string;
  /** Left panel supporting copy */
  brandTagline?: string;
  /** Left panel bullet list of value props */
  brandBullets?: string[];
  children: ReactNode;
}

const DEFAULT_BULLETS = [
  'Real-time collaboration across every workspace',
  'Tasks, projects and sprints in one mental model',
  'Built for teams that ship daily, not quarterly',
];

export function AuthLayout({
  title,
  subtitle,
  footer,
  brandHeadline = 'Run the work, not the meetings.',
  brandTagline = 'Velora is the project management surface modern product teams actually enjoy using.',
  brandBullets = DEFAULT_BULLETS,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel — hidden on small screens to keep the form front-and-center */}
        <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between velora-aurora p-12">
          <div className="velora-grid pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative z-10">
            <Link to="/login" aria-label="Velora home">
              <BrandMark size="lg" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 max-w-lg"
          >
            <h2 className="text-display font-semibold tracking-tight text-foreground">
              {brandHeadline}
            </h2>
            <Text tone="secondary" className="mt-4 !text-base">
              {brandTagline}
            </Text>

            <ul className="mt-8 space-y-3">
              {brandBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 inline-flex h-2 w-2 flex-none rounded-full bg-primary shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                  />
                  <span className="text-sm text-foreground/90">{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <Text variant="caption" tone="secondary" className="relative z-10 !normal-case !tracking-normal">
            &copy; {new Date().getFullYear()} Velora. Crafted for product teams.
          </Text>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-6 py-10 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <BrandMark size="md" />
            </div>

            <Card variant="elevated" padding="lg" className="backdrop-blur">
              <header className="mb-7">
                <Heading as="h1">{title}</Heading>
                {subtitle && (
                  <Text tone="secondary" className="mt-2">
                    {subtitle}
                  </Text>
                )}
              </header>

              {children}
            </Card>

            {footer && (
              <Text
                tone="secondary"
                className="mt-6 text-center"
              >
                {footer}
              </Text>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
