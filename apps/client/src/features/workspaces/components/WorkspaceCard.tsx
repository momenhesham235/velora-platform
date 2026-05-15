import { Card, Chip, Heading, Text } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '../types';

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const navigate = useNavigate();
  const memberCount = workspace.members?.length || 0;

  return (
    <button
      type="button"
      onClick={() => navigate(`/workspaces/${workspace.id}`)}
      className="text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    >
      <Card padding="lg">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Heading as="h3" size="h4" className="truncate">
              {workspace.name}
            </Heading>
            <Text tone="secondary" className="mt-1 text-xs">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </Text>
          </div>
          <Chip>{workspace.ownerId ? 'Owner' : 'Member'}</Chip>
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
