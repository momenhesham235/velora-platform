import { forwardRef, useId, type ReactNode } from 'react';
import {
  Input as HeroInput,
  type InputProps as HeroInputProps,
} from '@heroui/react';

/**
 * Velora Input — the only text input feature code should import.
 *
 * Variants:
 *   outline — bordered field on the canvas (default — best for forms)
 *   filled  — surface-filled field for inline/dense UI (search, toolbars)
 *
 * Design contract:
 *   - Labels render as REAL <label htmlFor> elements above the input, not
 *     through HeroUI's `label` prop. HeroUI's outside-label CSS conflicts
 *     with our classNames overrides and silently collapses back to inside
 *     (floating) placement, which collides with the placeholder. Rendering
 *     the label ourselves removes the entire failure mode and gives us
 *     normal HTML semantics (clicking the label focuses the field).
 *   - Default height is 44px — comfortable touch target, generous vertical
 *     rhythm for forms, matches Linear's input height.
 *   - Focus state is a single primary border on the wrapper (no stacked
 *     ring + border — that reads as a double outline).
 *
 * Error handling: pass `error?: string`. When truthy, the field renders
 * as invalid and surfaces the message below — no need to manage
 * `isInvalid` + `errorMessage` separately.
 */
export type InputVariant = 'outline' | 'filled';

export interface InputProps
  extends Omit<
    HeroInputProps,
    | 'variant'
    | 'isInvalid'
    | 'errorMessage'
    | 'radius'
    | 'labelPlacement'
    | 'label'
  > {
  variant?: InputVariant;
  /** Visible label rendered above the input (real <label> element). */
  label?: ReactNode;
  error?: string;
}

const VARIANT_MAP: Record<InputVariant, HeroInputProps['variant']> = {
  outline: 'bordered',
  filled: 'flat',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { variant = 'outline', size = 'md', label, error, id, ...rest },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const wrapperBase =
      variant === 'outline'
        ? 'bg-transparent border-divider'
        : 'bg-content2 border-transparent';

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-default-500"
          >
            {label}
          </label>
        )}
        <HeroInput
          ref={ref}
          id={inputId}
          variant={VARIANT_MAP[variant]}
          radius="md"
          size={size}
          labelPlacement="outside"
          isInvalid={Boolean(error)}
          errorMessage={error}
          classNames={{
            inputWrapper: [
              'min-h-[44px] px-3.5',
              wrapperBase,
              'border transition-all duration-150',
              'data-[hover=true]:border-default-400',
              'group-data-[focus=true]:border-primary',
              'group-data-[invalid=true]:border-danger',
            ].join(' '),
            input: [
              'text-sm text-foreground placeholder:text-default-500/70',
              'placeholder:font-normal',
              // HeroUI sets focus-visible outline on the native input; wrapper
              // already shows focus — keep a single visual indicator.
              '!outline-none outline-none focus-visible:!outline-none',
            ].join(' '),
            errorMessage: '!text-xs !text-danger !mt-0',
          }}
          {...rest}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
