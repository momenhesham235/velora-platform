import { useState } from 'react';
import { Button, Card, Heading, Spinner, Text } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { CreateWorkspaceModal } from '../components/CreateWorkspaceModal';
import { extractErrorMessage } from '@/services/api/handlers';

export function WorkspacesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isPending, isError, error, refetch } = useWorkspaces();

  const workspaces = data ?? [];
  const showEmpty = !isPending && !isError && workspaces.length === 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Workspaces"
        title="Your workspaces"
        description="Workspaces are top-level containers for your teams, projects and members."
        actions={
          <Button variant="primary" onPress={() => setCreateOpen(true)}>
            + New workspace
          </Button>
        }
      />

      {isPending ? (
        <div className="flex justify-center py-24">
          <Spinner label="Loading workspaces…" />
        </div>
      ) : isError ? (
        <Card padding="lg" className="border-danger/40">
          <Heading as="h2" size="h3" className="text-danger">
            Couldn’t load workspaces
          </Heading>
          <Text tone="secondary" className="mt-2">
            {extractErrorMessage(error, 'Please try again in a moment.')}
          </Text>
          <Button variant="secondary" className="mt-4" onPress={() => refetch()}>
            Retry
          </Button>
        </Card>
      ) : showEmpty ? (
        <Card padding="none" className="border-dashed">
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                <path
                  d="M3 9 12 4l9 5-9 5-9-5Zm0 5 9 5 9-5M3 19l9 5 9-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <Heading as="h2" size="h3">
              Create your first workspace
            </Heading>
            <Text tone="secondary" className="max-w-md">
              Workspaces keep separate teams, clients, or initiatives cleanly
              isolated. You can always rename or archive them later.
            </Text>
            <Button
              variant="primary"
              className="mt-2"
              onPress={() => setCreateOpen(true)}
            >
              + New workspace
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}

      <CreateWorkspaceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
