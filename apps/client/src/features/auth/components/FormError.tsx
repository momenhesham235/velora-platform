import { motion, AnimatePresence } from 'framer-motion';

interface FormErrorProps {
  message?: string | null;
}

/**
 * Inline banner used by auth pages to surface backend errors.
 * Sits inside the form Card so it doesn't push layout when absent.
 */
export function FormError({ message }: FormErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-3 text-sm text-danger"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 h-4 w-4 flex-none"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-.75-11.25a.75.75 0 1 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="leading-snug">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
