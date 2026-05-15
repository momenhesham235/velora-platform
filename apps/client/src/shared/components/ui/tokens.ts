/**
 * Velora design tokens — TypeScript source of truth.
 *
 * For CSS, use Tailwind utility classes that are wired to HeroUI's
 * `velora-dark` theme in `tailwind.config.ts` (e.g. `bg-background`,
 * `text-foreground`, `border-divider`).
 *
 * Import from this file ONLY when you need raw values at runtime —
 * chart palettes, framer-motion `animate` props, inline `style` for
 * dynamic gradients, etc. Never mirror these as Tailwind arbitrary
 * values (`bg-[#0B0F1A]`) — that defeats the design system.
 *
 * Palette follows the 60 / 30 / 10 rule:
 *   60% — surface.background
 *   30% — surface.raised, surface.overlay
 *   10% — accent.primary
 */

export const color = {
  surface: {
    background: '#0B0F1A',
    raised: '#111827',
    overlay: '#1F2937',
  },
  accent: {
    primary: '#6366F1',
    primaryHover: '#4F52D1',
    primarySubtle: '#858EFB',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    disabled: '#6B7280',
  },
  border: {
    default: '#2A2F3A',
    strong: '#374151',
  },
  feedback: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
} as const;

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  full: '9999px',
} as const;

export const motion = {
  duration: {
    fast: 120,
    base: 200,
    slow: 320,
  },
  easing: [0.4, 0, 0.2, 1] as const,
} as const;

export type Color = typeof color;
export type Radius = typeof radius;
export type Motion = typeof motion;
