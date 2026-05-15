import { forwardRef, createElement, type HTMLAttributes } from 'react';

/**
 * Velora Text — body + caption scale.
 *
 * Variant controls size + default element:
 *   body    — base body copy (renders <p>)
 *   caption — small uppercase eyebrows / metadata (renders <span>)
 *
 * Tone controls color, independent of size.
 */
export type TextVariant = 'body' | 'caption';
export type TextTone = 'primary' | 'secondary' | 'accent' | 'danger';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  tone?: TextTone;
  /** Override the rendered element if the default (<p>/<span>) is wrong. */
  as?: 'p' | 'span' | 'div';
}

const VARIANT_CLASSES: Record<TextVariant, string> = {
  body: 'text-sm leading-relaxed',
  caption: 'text-xs uppercase tracking-[0.18em] font-semibold',
};

const VARIANT_ELEMENT: Record<TextVariant, 'p' | 'span'> = {
  body: 'p',
  caption: 'span',
};

const TONE_CLASSES: Record<TextTone, string> = {
  primary: 'text-foreground',
  secondary: 'text-default-500',
  accent: 'text-primary',
  danger: 'text-danger',
};

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = 'body',
      tone = 'primary',
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const element = as ?? VARIANT_ELEMENT[variant];
    return createElement(
      element,
      {
        ref,
        className: [
          VARIANT_CLASSES[variant],
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

Text.displayName = 'Text';
