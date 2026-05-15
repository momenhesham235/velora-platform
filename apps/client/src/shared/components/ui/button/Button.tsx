import { forwardRef, type ReactNode } from 'react';
import {
  Button as HeroButton,
  type ButtonProps as HeroButtonProps,
} from '@heroui/react';

/**
 * Velora Button — the only Button feature code is allowed to import.
 *
 * Variants are intent-driven, not visual:
 *   primary   — main affordance on a screen ("Sign in", "Create project")
 *   secondary — supporting action ("Cancel", "Skip")
 *   ghost     — low-emphasis affordance inside dense UIs (icon buttons, toolbars)
 *
 * Tone (destructive, etc.) is intentionally NOT folded into variant.
 * Add it as an orthogonal prop if/when product needs it.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<
    HeroButtonProps,
    'variant' | 'color' | 'size' | 'isLoading' | 'radius'
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const VARIANT_MAP: Record<
  ButtonVariant,
  { variant: HeroButtonProps['variant']; color: HeroButtonProps['color'] }
> = {
  primary: { variant: 'solid', color: 'primary' },
  secondary: { variant: 'flat', color: 'default' },
  ghost: { variant: 'light', color: 'default' },
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'shadow-[0_8px_24px_-12px_rgba(99,102,241,0.55)] hover:brightness-110',
  secondary:
    'bg-content2 text-foreground hover:bg-content3 border border-divider',
  ghost: 'text-default-500 hover:bg-content2 hover:text-foreground',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      fullWidth,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const mapped = VARIANT_MAP[variant] ?? VARIANT_MAP.primary;

    return (
      <HeroButton
        ref={ref}
        variant={mapped.variant}
        color={mapped.color}
        size={size}
        radius="md"
        isLoading={loading}
        fullWidth={fullWidth}
        className={[
          'font-medium tracking-tight transition-all active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          VARIANT_CLASSES[variant],
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </HeroButton>
    );
  },
);

Button.displayName = 'Button';
