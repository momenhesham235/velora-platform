import { forwardRef, type ReactNode, type Ref } from 'react';
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

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = 'sm', children, ...rest }, ref) => {
    return (
      <HeroCheckbox
        ref={ref as Ref<HTMLInputElement>}
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
