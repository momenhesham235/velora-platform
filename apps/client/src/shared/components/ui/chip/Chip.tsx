import { type ReactNode } from 'react';
import {
  Chip as HeroChip,
  type ChipProps as HeroChipProps,
} from '@heroui/react';

/**
 * Velora Chip — compact status / count badge.
 *
 * Tone is semantic (not visual): pick by what the chip *means*, not how it looks.
 *   neutral — counts, metadata          (bg-content2)
 *   primary — brand emphasis             (bg-primary/15 text-primary)
 *   success — completed / verified       (bg-success/15 text-success)
 *   warning — attention / pending        (bg-warning/15 text-warning)
 *   danger  — error / overdue            (bg-danger/15 text-danger)
 */
export type ChipTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type ChipSize = 'sm' | 'md';

export interface ChipProps
  extends Omit<HeroChipProps, 'color' | 'variant' | 'classNames' | 'size'> {
  tone?: ChipTone;
  size?: ChipSize;
  children: ReactNode;
}

const TONE_CLASSES: Record<ChipTone, string> = {
  neutral: 'bg-content2 text-default-500',
  primary: 'bg-primary/15 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
};

export function Chip({ tone = 'neutral', size = 'sm', children, ...rest }: ChipProps) {
  return (
    <HeroChip
      size={size}
      variant="flat"
      classNames={{
        base: TONE_CLASSES[tone],
        content: 'font-medium',
      }}
      {...rest}
    >
      {children}
    </HeroChip>
  );
}
