import {
  Progress as HeroProgress,
  type ProgressProps as HeroProgressProps,
} from '@heroui/react';

/**
 * Velora Progress — linear progress indicator (0-100).
 * aria-label is required (HeroUI/react-aria enforces this for a11y).
 */
export type ProgressSize = 'sm' | 'md';

export interface ProgressProps
  extends Omit<
    HeroProgressProps,
    'color' | 'classNames' | 'radius' | 'size' | 'aria-label'
  > {
  size?: ProgressSize;
  'aria-label': string;
}

export function Progress({ size = 'sm', ...rest }: ProgressProps) {
  return (
    <HeroProgress
      size={size}
      color="primary"
      radius="full"
      classNames={{
        track: 'bg-content2',
        indicator: 'bg-primary',
      }}
      {...rest}
    />
  );
}
