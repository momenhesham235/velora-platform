import { forwardRef } from 'react';
import {
  Avatar as HeroAvatar,
  type AvatarProps as HeroAvatarProps,
} from '@heroui/react';

/**
 * Velora Avatar — initials or image, branded with primary tint by default.
 */
export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps
  extends Omit<HeroAvatarProps, 'size' | 'classNames' | 'radius'> {
  size?: AvatarSize;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = 'md', name, ...rest }, ref) => {
    return (
      <HeroAvatar
        ref={ref}
        size={size}
        radius="full"
        name={name}
        classNames={{
          base: 'bg-primary/20 text-primary',
          name: 'font-semibold',
        }}
        {...rest}
      />
    );
  },
);

Avatar.displayName = 'Avatar';
