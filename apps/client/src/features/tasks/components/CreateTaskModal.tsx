import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Textarea } from '@/shared/components/ui';
import { FormError } from '@/features/auth/components/FormError';
import { extractErrorMessage } from '@/services/api/handlers';
import { useCreateTask } from '../hooks/useCreateTask';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { createTaskSchema, type CreateTaskFormInput } from '../schemas/task.schema';
import { TaskStatus } from '@velora/types';

interface CreateTaskModalProps {
  workspaceId: string;
  open: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function CreateTaskModal({
  workspaceId,
  open,
  onClose,
  defaultProjectId,
}: CreateTaskModalProps) {
  const create = useCreateTask(workspaceId);
  const { data: projects = [], isPending: projectsLoading } =
    useProjects(workspaceId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId: defaultProjectId ?? '',
      status: TaskStatus.TODO,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      projectId: defaultProjectId ?? '',
      title: '',
      description: '',
      status: TaskStatus.TODO,
    });
    create.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultProjectId]);

  const onSubmit = (input: CreateTaskFormInput) => {
    create.mutate(input, { onSuccess: () => onClose() });
  };

  const submitErrorMessage = create.error
    ? extractErrorMessage(create.error, 'Could not create task.')
    : null;

  const noProjects = !projectsLoading && projects.length === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New task"
      description="Add a task to a project in this workspace."
      footer={
        <>
          <Button variant="ghost" onPress={onClose} isDisabled={create.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={() => handleSubmit(onSubmit)()}
            loading={create.isPending}
            isDisabled={noProjects}
          >
            Create task
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="projectId" className="text-sm font-medium text-foreground">
            Project
          </label>
          <select
            id="projectId"
            className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            disabled={projectsLoading || noProjects}
            {...register('projectId')}
          >
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.projectId?.message ? (
            <p className="text-xs text-danger">{errors.projectId.message}</p>
          ) : null}
          {noProjects ? (
            <p className="text-xs text-warning">
              Create a project before adding tasks.
            </p>
          ) : null}
        </div>
        <Input
          label="Title"
          placeholder="Draft API spec"
          autoFocus
          error={errors.title?.message}
          {...register('title')}
        />
        <Textarea
          label="Description"
          placeholder="Optional details"
          error={errors.description?.message}
          {...register('description')}
        />
        {submitErrorMessage ? <FormError message={submitErrorMessage} /> : null}
      </form>
    </Modal>
  );
}
