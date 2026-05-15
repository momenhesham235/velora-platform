import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal } from '@/shared/components/ui';
import { FormError } from '@/features/auth/components/FormError';
import { extractErrorMessage } from '@/services/api/handlers';
import { useCreateWorkspace } from '../hooks/useCreateWorkspace';
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from '../schemas/workspace.schema';

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({ open, onClose }: CreateWorkspaceModalProps) {
  const create = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  // Reset state every time the modal opens so a half-filled previous attempt
  // doesn't bleed into a new one.
  useEffect(() => {
    if (open) {
      reset();
      create.reset();
    }
  }, [open, reset, create]);

  const onSubmit = (input: CreateWorkspaceInput) => {
    create.mutate(input, { onSuccess: () => onClose() });
  };

  const submitErrorMessage = create.error
    ? extractErrorMessage(create.error, 'Could not create workspace.')
    : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New workspace"
      description="Create a container for a team, client, or initiative. You can rename or archive it later."
      footer={
        <>
          <Button variant="ghost" onPress={onClose} isDisabled={create.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={() => handleSubmit(onSubmit)()}
            isLoading={create.isPending}
          >
            Create workspace
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
          placeholder="Acme Marketing"
          autoFocus
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Slug"
          placeholder="acme-marketing"
          description="Optional. Auto-generated from the name when blank."
          isInvalid={!!errors.slug}
          errorMessage={errors.slug?.message}
          {...register('slug')}
        />
        <Input
          label="Description"
          placeholder="What is this workspace for?"
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          {...register('description')}
        />
        {submitErrorMessage ? <FormError message={submitErrorMessage} /> : null}
      </form>
    </Modal>
  );
}
