import { forwardRef, createElement, type HTMLAttributes } from 'react';

/**
 * Velora Heading — semantic + visual scale (h1 / h2 / h3).
 *
 * `as` controls the rendered element (document outline).
 * `size` overrides visual size if the document outline requires a different
 * level than the visual emphasis (defaults to match `as`).
 *
 * Tones map to text tokens:
 *   primary   — foreground (default for headings)
 *   secondary — default-500 (rare for headings, used for eyebrows)
 *   accent    — primary (brand emphasis)
 */
export type HeadingLevel = 'h1' | 'h2' | 'h3';
export type HeadingTone = 'primary' | 'secondary' | 'accent';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingLevel;
  tone?: HeadingTone;
}

const SIZE_CLASSES: Record<HeadingLevel, string> = {
  h1: 'text-h1 font-semibold tracking-tight',
  h2: 'text-h2 font-semibold tracking-tight',
  h3: 'text-h3 font-medium',
};

const TONE_CLASSES: Record<HeadingTone, string> = {
  primary: 'text-foreground',
  secondary: 'text-default-500',
  accent: 'text-primary',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { as = 'h1', size, tone = 'primary', className, children, ...rest },
    ref,
  ) => {
    return createElement(
      as,
      {
        ref,
        className: [
          SIZE_CLASSES[size ?? as],
          TONE_CLASSES[tone],
          className ?? '',
        ]
          .filter(Boolean)
          .join(' '),
        ...rest,
      },
      children,
    );
  },
);

Heading.displayName = 'Heading';
