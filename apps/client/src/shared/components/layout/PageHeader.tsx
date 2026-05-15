import { type ReactNode } from 'react';
import { Heading, Text } from '@/shared/components/ui';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow && (
          <Text variant="caption" tone="accent">
            {eyebrow}
          </Text>
        )}
        <Heading as="h1">{title}</Heading>
        {description && (
          <Text tone="secondary" className="max-w-2xl">
            {description}
          </Text>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
