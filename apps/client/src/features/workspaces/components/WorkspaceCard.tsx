import { Card, Chip, Heading, Text } from '@/shared/components/ui';
import type { Workspace } from '../types';

interface WorkspaceCardProps {
  workspace: Workspace;
  onOpen?: (workspace: Workspace) => void;
}

export function WorkspaceCard({ workspace, onOpen }: WorkspaceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(workspace)}
      className="text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    >
      <Card padding="lg">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Heading as="h3" size="h4" className="truncate">
              {workspace.name}
            </Heading>
            <Text tone="secondary" className="mt-1 truncate text-xs">
              /{workspace.slug}
            </Text>
          </div>
          <Chip>{workspace.memberCount} members</Chip>
        </div>
        {workspace.description ? (
          <Text tone="secondary" className="mt-3 line-clamp-2">
            {workspace.description}
          </Text>
        ) : null}
      </Card>
    </button>
  );
}
