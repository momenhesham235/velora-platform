import { forwardRef, useId, type ReactNode } from 'react';
import {
  Textarea as HeroTextarea,
  type TextAreaProps as HeroTextareaProps,
} from '@heroui/react';

/**
 * Velora Textarea — multi-line text input.
 *
 * Variants:
 *   outline — bordered field on the canvas (default — best for forms)
 *   filled  — surface-filled field for inline/dense UI
 *
 * Design contract:
 *   - Labels render as REAL <label htmlFor> elements above the textarea
 *   - Default min-height provides comfortable space for multi-line input
 *   - Focus state is a single primary border on the wrapper
 *
 * Error handling: pass `error?: string`. When truthy, the field renders
 * as invalid and surfaces the message below.
 */
export type TextareaVariant = 'outline' | 'filled';

export interface TextareaProps
  extends Omit<
    HeroTextareaProps,
    | 'variant'
    | 'isInvalid'
    | 'errorMessage'
    | 'radius'
    | 'labelPlacement'
    | 'label'
  > {
  variant?: TextareaVariant;
  /** Visible label rendered above the textarea (real <label> element). */
  label?: ReactNode;
  error?: string;
}

const VARIANT_MAP: Record<TextareaVariant, HeroTextareaProps['variant']> = {
  outline: 'bordered',
  filled: 'flat',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { variant = 'outline', size = 'md', label, error, id, minRows = 3, ...rest },
    ref,
  ) => {
    const autoId = useId();
    const textareaId = id ?? autoId;

    const wrapperBase =
      variant === 'outline'
        ? 'bg-transparent border-divider'
        : 'bg-content2 border-transparent';

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-default-500"
          >
            {label}
          </label>
        )}
        <HeroTextarea
          ref={ref}
          id={textareaId}
          variant={VARIANT_MAP[variant]}
          radius="md"
          size={size}
          minRows={minRows}
          labelPlacement="outside"
          isInvalid={Boolean(error)}
          errorMessage={error}
          classNames={{
            inputWrapper: [
              'min-h-[88px] px-3.5 py-2.5',
              wrapperBase,
              'border transition-all duration-150',
              'data-[hover=true]:border-default-400',
              'group-data-[focus=true]:border-primary',
              'group-data-[invalid=true]:border-danger',
            ].join(' '),
            input: [
              'text-sm text-foreground placeholder:text-default-500/70',
              'placeholder:font-normal',
              // HeroUI sets focus-visible outline on the native textarea; wrapper
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

Textarea.displayName = 'Textarea';
