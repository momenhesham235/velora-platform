import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

/**
 * Velora design system.
 *
 * 60 / 30 / 10 split, applied through HeroUI's semantic tokens so every
 * component (Button, Card, Input, Dropdown, Modal, ...) inherits the same
 * palette without per-call overrides.
 *
 *   60% background  : #0B0F1A
 *   30% surfaces    : #111827 (content1)  / #1F2937 (content2/3/4)
 *   10% accent      : #6366F1 (indigo)
 *
 * Text  primary : #F9FAFB
 * Text  muted   : #9CA3AF
 * Borders       : #2A2F3A
 */
const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        // tightened scale for SaaS density
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display':    ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1':         ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2':         ['1.5rem',   { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'h3':         ['1.25rem',  { lineHeight: '1.3' }],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out both',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        'velora-dark': {
          extend: 'dark',
          colors: {
            background: '#0B0F1A',
            foreground: '#F9FAFB',
            divider: '#2A2F3A',
            focus: '#6366F1',
            content1: { DEFAULT: '#111827', foreground: '#F9FAFB' },
            content2: { DEFAULT: '#1F2937', foreground: '#F9FAFB' },
            content3: { DEFAULT: '#1F2937', foreground: '#F9FAFB' },
            content4: { DEFAULT: '#2A2F3A', foreground: '#F9FAFB' },
            default: {
              50:  '#0B0F1A',
              100: '#111827',
              200: '#1F2937',
              300: '#2A2F3A',
              400: '#374151',
              500: '#9CA3AF',
              600: '#D1D5DB',
              700: '#E5E7EB',
              800: '#F3F4F6',
              900: '#F9FAFB',
              DEFAULT: '#1F2937',
              foreground: '#F9FAFB',
            },
            primary: {
              50:  '#EEF0FF',
              100: '#E0E3FF',
              200: '#C2C8FF',
              300: '#A4ABFF',
              400: '#858EFB',
              500: '#6366F1',
              600: '#4F52D1',
              700: '#3F41A8',
              800: '#2E307D',
              900: '#1E1F54',
              DEFAULT: '#6366F1',
              foreground: '#FFFFFF',
            },
            secondary: {
              DEFAULT: '#8B5CF6',
              foreground: '#FFFFFF',
            },
            success: { DEFAULT: '#10B981', foreground: '#FFFFFF' },
            warning: { DEFAULT: '#F59E0B', foreground: '#0B0F1A' },
            danger:  { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
          },
          layout: {
            radius: { small: '6px', medium: '10px', large: '14px' },
            borderWidth: { small: '1px', medium: '1px', large: '2px' },
          },
        },
      },
    }),
  ],
};

export default config;
