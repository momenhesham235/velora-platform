import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Permission } from '@velora/types';
import { Button, Card, Heading, Spinner, Text } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { SelectWorkspacePrompt } from '@/shared/components/layout/SelectWorkspacePrompt';
import { useResolvedWorkspaceId } from '@/shared/hooks/useResolvedWorkspaceId';
import { usePermission } from '@/shared/hooks/usePermission';
import { useWorkspace } from '@/features/workspaces/hooks/useWorkspace';
import { workspaceRoute } from '@/shared/constants';
import { extractErrorMessage } from '@/services/api/handlers';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { CreateProjectModal } from '../components/CreateProjectModal';

export function ProjectsPage() {
  const workspaceId = useResolvedWorkspaceId();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: workspace } = useWorkspace(workspaceId ?? '');
  const { data: projects = [], isPending, isError, error, refetch } =
    useProjects(workspaceId);
  const canCreate = usePermission(workspaceId, Permission.PROJECT_CREATE);

  if (!workspaceId) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <PageHeader
          eyebrow="Projects"
          title="Projects"
          description="Group related tasks under a workspace project."
        />
        <SelectWorkspacePrompt resourceLabel="projects" />
      </div>
    );
  }

  const showEmpty = !isPending && !isError && projects.length === 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow={workspace?.name ?? 'Workspace'}
        title="Projects"
        description="Group related tasks, sprints and milestones under a single project."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to={workspaceRoute.tasks(workspaceId)}>
              <Button variant="secondary">View tasks</Button>
            </Link>
            {canCreate ? (
              <Button variant="primary" onPress={() => setCreateOpen(true)}>
                + New project
              </Button>
            ) : null}
          </div>
        }
      />

      {isPending ? (
        <div className="flex justify-center py-24">
          <Spinner label="Loading projects…" />
        </div>
      ) : isError ? (
        <Card padding="lg" className="border-danger/40">
          <Heading as="h2" size="h3" className="text-danger">
            Couldn&apos;t load projects
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
            <Heading as="h2" size="h3">
              No projects yet
            </Heading>
            <Text tone="secondary" className="max-w-md">
              Create your first project to start organizing tasks in this
              workspace.
            </Text>
            {canCreate ? (
              <Button
                variant="primary"
                className="mt-2"
                onPress={() => setCreateOpen(true)}
              >
                + New project
              </Button>
            ) : null}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              workspaceId={workspaceId}
              project={project}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        workspaceId={workspaceId}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
