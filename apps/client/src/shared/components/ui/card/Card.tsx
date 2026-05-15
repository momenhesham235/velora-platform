import { forwardRef, type HTMLAttributes } from 'react';

/**
 * Velora Card — standard surface container.
 *
 * Variants:
 *   default  — workhorse surface (forms, dashboard panels) — content1
 *   subtle   — inline info box (sidebar callouts, helper banners) — content2 @ low opacity
 *   elevated — surface-with-lift (modal panel, hover-able cards)  — content1 + shadow
 *
 * Padding is an explicit prop so we never sprinkle raw `p-7` across screens.
 */
export type CardVariant = 'default' | 'subtle' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'bg-content1 border border-divider',
  subtle: 'bg-content2/60 border border-divider',
  elevated:
    'bg-content1 border border-divider shadow-[0_24px_48px_-24px_rgba(0,0,0,0.75)]',
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', className, children, ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-xl text-foreground',
          VARIANT_CLASSES[variant],
          PADDING_CLASSES[padding],
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
