import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, Textarea } from "@/shared/components/ui";
import { FormError } from "@/features/auth/components/FormError";
import { extractErrorMessage } from "@/services/api/handlers";
import { useCreateWorkspace } from "../hooks/useCreateWorkspace";
import { z } from "zod";
import type { CreateWorkspaceInput } from "../types";

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(100, "Workspace name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({
  open,
  onClose,
}: CreateWorkspaceModalProps) {
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
    if (!open) return;

    reset();
    create.reset();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = (input: CreateWorkspaceInput) => {
    create.mutate(input, { onSuccess: () => onClose() });
  };

  const submitErrorMessage = create.error
    ? extractErrorMessage(create.error, "Could not create workspace.")
    : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New workspace"
      description="Create a container for a team, client, or initiative. You can rename or archive it later."
      footer={
        <>
          <Button
            variant="ghost"
            onPress={onClose}
            isDisabled={create.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={() => handleSubmit(onSubmit)()}
            loading={create.isPending}
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
          error={errors.name?.message}
          {...register("name")}
        />
        <Textarea
          label="Description"
          placeholder="What is this workspace for?"
          error={errors.description?.message}
          {...register("description")}
        />
        {submitErrorMessage ? <FormError message={submitErrorMessage} /> : null}
      </form>
    </Modal>
  );
}
