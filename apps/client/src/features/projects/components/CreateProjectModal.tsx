import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Textarea } from '@/shared/components/ui';
import { FormError } from '@/features/auth/components/FormError';
import { extractErrorMessage } from '@/services/api/handlers';
import { useCreateProject } from '../hooks/useCreateProject';
import { createProjectSchema, type CreateProjectFormInput } from '../schemas/project.schema';

interface CreateProjectModalProps {
  workspaceId: string;
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({
  workspaceId,
  open,
  onClose,
}: CreateProjectModalProps) {
  const create = useCreateProject(workspaceId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormInput>({
    resolver: zodResolver(createProjectSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset();
    create.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = (input: CreateProjectFormInput) => {
    create.mutate(input, { onSuccess: () => onClose() });
  };

  const submitErrorMessage = create.error
    ? extractErrorMessage(create.error, 'Could not create project.')
    : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New project"
      description="Group related tasks under a single project."
      footer={
        <>
          <Button variant="ghost" onPress={onClose} isDisabled={create.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={() => handleSubmit(onSubmit)()}
            loading={create.isPending}
          >
            Create project
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
          placeholder="Website redesign"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          label="Description"
          placeholder="What is this project about?"
          error={errors.description?.message}
          {...register('description')}
        />
        {submitErrorMessage ? <FormError message={submitErrorMessage} /> : null}
      </form>
    </Modal>
  );
}
