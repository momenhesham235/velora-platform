import {
  Kbd as HeroKbd,
  type KbdProps as HeroKbdProps,
} from '@heroui/react';

/**
 * Velora Kbd — keyboard-shortcut hint pill (e.g. ⌘K).
 * Pass `keys` for platform-aware modifier rendering.
 */
export type KbdProps = HeroKbdProps;

export function Kbd(props: KbdProps) {
  return <HeroKbd {...props} />;
}
