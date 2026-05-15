import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Permission } from '@velora/types';
import { Button, Card, Heading, Spinner, Text } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { SelectWorkspacePrompt } from '@/shared/components/layout/SelectWorkspacePrompt';
import { useResolvedWorkspaceId } from '@/shared/hooks/useResolvedWorkspaceId';
import { usePermission } from '@/shared/hooks/usePermission';
import { useWorkspace } from '@/features/workspaces/hooks/useWorkspace';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { workspaceRoute } from '@/shared/constants';
import { extractErrorMessage } from '@/services/api/handlers';
import { useTasks, useUpdateTaskStatus, useDeleteTask } from '../hooks';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal';

export function TasksPage() {
  const workspaceId = useResolvedWorkspaceId();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectFilter = searchParams.get('projectId') ?? undefined;
  const [createOpen, setCreateOpen] = useState(false);

  const { data: workspace } = useWorkspace(workspaceId ?? '');
  const { data: projects = [] } = useProjects(workspaceId);
  const { data: tasks = [], isPending, isError, error, refetch } = useTasks(
    workspaceId,
    { projectId: projectFilter }
  );

  const updateStatus = useUpdateTaskStatus(workspaceId);
  const deleteTask = useDeleteTask(workspaceId);
  const canCreate = usePermission(workspaceId, Permission.TASK_CREATE);

  const projectMap = useMemo(
    () => new Map(projects.map((p) => [p.id, p])),
    [projects]
  );

  if (!workspaceId) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <PageHeader
          eyebrow="Tasks"
          title="Tasks"
          description="Track work across projects in your workspace."
        />
        <SelectWorkspacePrompt resourceLabel="tasks" />
      </div>
    );
  }

  const showEmpty = !isPending && !isError && tasks.length === 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow={workspace?.name ?? 'Workspace'}
        title="Tasks"
        description="Every task in this workspace, grouped by project."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to={workspaceRoute.projects(workspaceId)}>
              <Button variant="secondary">View projects</Button>
            </Link>
            {canCreate ? (
              <Button variant="primary" onPress={() => setCreateOpen(true)}>
                + New task
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-default-500">Project</span>
          <select
            value={projectFilter ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setSearchParams({ projectId: value });
              } else {
                setSearchParams({});
              }
            }}
            className="rounded-lg border border-divider bg-content1 px-2 py-1.5 text-sm"
            aria-label="Filter by project"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isPending ? (
        <div className="flex justify-center py-24">
          <Spinner label="Loading tasks…" />
        </div>
      ) : isError ? (
        <Card padding="lg" className="border-danger/40">
          <Heading as="h2" size="h3" className="text-danger">
            Couldn&apos;t load tasks
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
              No tasks yet
            </Heading>
            <Text tone="secondary" className="max-w-md">
              {projectFilter
                ? 'No tasks in this project. Create one to get started.'
                : 'Create a task or add tasks to your projects.'}
            </Text>
            {canCreate && projects.length > 0 ? (
              <Button
                variant="primary"
                className="mt-2"
                onPress={() => setCreateOpen(true)}
              >
                + New task
              </Button>
            ) : null}
            {projects.length === 0 ? (
              <Link to={workspaceRoute.projects(workspaceId)} className="mt-2">
                <Button variant="secondary">Create a project first</Button>
              </Link>
            ) : null}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={projectMap.get(task.projectId)}
              onStatusChange={(taskId, status, projectId) =>
                updateStatus.mutate({ taskId, status, projectId })
              }
              onDelete={(taskId) => deleteTask.mutate(taskId)}
              isUpdating={updateStatus.isPending || deleteTask.isPending}
            />
          ))}
        </div>
      )}

      <CreateTaskModal
        workspaceId={workspaceId}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultProjectId={projectFilter}
      />
    </div>
  );
}
