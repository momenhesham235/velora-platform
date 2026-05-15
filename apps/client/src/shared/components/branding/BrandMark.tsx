interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  withWordmark?: boolean;
  className?: string;
}

const SIZE: Record<NonNullable<BrandMarkProps['size']>, { box: number; text: string }> = {
  sm: { box: 28, text: 'text-base' },
  md: { box: 36, text: 'text-lg' },
  lg: { box: 44, text: 'text-2xl' },
};

/**
 * BrandMark — Velora logo (mark + optional wordmark).
 *
 * Gradient uses Tailwind tokens (primary → secondary → primary-700) so
 * the brand inherits any future palette change automatically.
 */
export function BrandMark({
  size = 'md',
  withWordmark = true,
  className = '',
}: BrandMarkProps) {
  const dim = SIZE[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-primary-700 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.55)] ring-1 ring-primary/40"
        style={{ width: dim.box, height: dim.box }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
          width={dim.box * 0.55}
          height={dim.box * 0.55}
          aria-hidden
        >
          <path d="M4 4h4l4 12 4-12h4l-6 16h-4L4 4z" fill="currentColor" />
        </svg>
      </span>
      {withWordmark && (
        <span
          className={`${dim.text} font-semibold tracking-tight text-foreground`}
        >
          Velora
        </span>
      )}
    </div>
  );
}
