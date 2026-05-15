import { type ReactNode } from 'react';
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';

/**
 * Velora Modal — controlled overlay primitive.
 *
 * Structure is fixed (title → body → footer) to keep modals consistent
 * across the app. Caller controls open state — no internal toggle.
 *
 * Accessibility (focus trap, ESC close, body-scroll lock, focus restore)
 * comes from HeroUI/react-aria underneath.
 */
export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  /** Close when the backdrop is clicked. Default: true. */
  dismissOnBackdrop?: boolean;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  dismissOnBackdrop = true,
  children,
}: ModalProps) {
  return (
    <HeroModal
      isOpen={open}
      onClose={onClose}
      size={size}
      isDismissable={dismissOnBackdrop}
      backdrop="opaque"
      radius="lg"
      classNames={{
        backdrop: 'bg-background/80 backdrop-blur-sm',
        base: 'bg-content1 border border-divider text-foreground',
        header: 'border-b border-divider px-6 py-5',
        body: 'px-6 py-5',
        footer: 'border-t border-divider px-6 py-4 gap-2',
        closeButton:
          'text-default-500 hover:bg-content2 hover:text-foreground transition-colors',
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            {(title || description) && (
              <ModalHeader className="flex flex-col gap-1">
                {title && (
                  <h2 className="text-h3 font-semibold tracking-tight text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-default-500">{description}</p>
                )}
              </ModalHeader>
            )}
            <ModalBody>{children}</ModalBody>
            {footer && (
              <ModalFooter>
                {typeof footer === 'function'
                  ? (footer as (close: () => void) => ReactNode)(close)
                  : footer}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </HeroModal>
  );
}
