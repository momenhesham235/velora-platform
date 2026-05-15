import {
  Spinner as HeroSpinner,
  type SpinnerProps as HeroSpinnerProps,
} from '@heroui/react';

/**
 * Velora Spinner — loading indicator. Always primary-tinted.
 */
export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps
  extends Omit<HeroSpinnerProps, 'color' | 'labelColor'> {
  size?: SpinnerSize;
}

export function Spinner({ size = 'md', ...rest }: SpinnerProps) {
  return (
    <HeroSpinner
      size={size}
      color="primary"
      labelColor="foreground"
      {...rest}
    />
  );
}
