import { forwardRef, type ReactNode } from 'react';
import {
  Checkbox as HeroCheckbox,
  type CheckboxProps as HeroCheckboxProps,
} from '@heroui/react';

/**
 * Velora Checkbox — small form primitive with accessible label binding.
 * Always controlled or uncontrolled via HeroUI's standard `isSelected` / `defaultSelected`.
 */
export interface CheckboxProps
  extends Omit<HeroCheckboxProps, 'color' | 'radius' | 'classNames'> {
  children?: ReactNode;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ size = 'sm', children, ...rest }, ref) => {
    return (
      <HeroCheckbox
        ref={ref}
        size={size}
        color="primary"
        radius="sm"
        classNames={{
          label: 'text-default-500 text-sm',
          wrapper:
            'before:border-divider after:bg-primary group-data-[selected=true]:before:border-primary',
        }}
        {...rest}
      >
        {children}
      </HeroCheckbox>
    );
  },
);

Checkbox.displayName = 'Checkbox';
