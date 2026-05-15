import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Heading,
  Spinner,
  Text,
  Chip,
} from '@/shared/components/ui';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import {
  useWorkspace,
  useWorkspaceMembers,
  useDeleteWorkspace,
} from '../hooks';
import { extractErrorMessage } from '@/services/api/handlers';
import { WorkspaceRole } from '../types';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data: workspace,
    isPending: workspaceLoading,
    isError: workspaceError,
    error: workspaceErrorData,
  } = useWorkspace(id!);

  const {
    data: members,
    isPending: membersLoading,
    isError: membersError,
  } = useWorkspaceMembers(id!);

  const deleteWorkspace = useDeleteWorkspace();

  const isOwner = workspace?.ownerId === user?.id;
  const currentUserMember = members?.find((m) => m.userId === user?.id);

  const handleDelete = () => {
    if (!id) return;
    deleteWorkspace.mutate(id, {
      onSuccess: () => {
        navigate('/workspaces');
      },
    });
  };

  if (workspaceLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner label="Loading workspace…" />
      </div>
    );
  }

  if (workspaceError || !workspace) {
    return (
      <Card padding="lg" className="border-danger/40">
        <Heading as="h2" size="h4" className="text-danger">
          Couldn't load workspace
        </Heading>
        <Text tone="secondary" className="mt-2">
          {extractErrorMessage(
            workspaceErrorData,
            'Please try again in a moment.'
          )}
        </Text>
        <Button
          variant="secondary"
          className="mt-4"
          onPress={() => navigate('/workspaces')}
        >
          Back to workspaces
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Workspace"
        title={workspace.name}
        description={workspace.description || 'No description provided'}
        actions={
          <div className="flex gap-2">
            {isOwner && (
              <Button
                variant="danger"
                onPress={() => setShowDeleteConfirm(true)}
              >
                Delete Workspace
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Workspace Info */}
        <Card padding="lg">
          <Heading as="h3" size="h4" className="mb-4">
            Workspace Information
          </Heading>
          <div className="space-y-3">
            <div>
              <Text tone="secondary" className="text-sm">
                Name
              </Text>
              <Text className="font-medium">{workspace.name}</Text>
            </div>
            <div>
              <Text tone="secondary" className="text-sm">
                Description
              </Text>
              <Text>{workspace.description || 'No description'}</Text>
            </div>
            <div>
              <Text tone="secondary" className="text-sm">
                Your Role
              </Text>
              <Chip variant="primary">
                {currentUserMember?.role || 'Unknown'}
              </Chip>
            </div>
            <div>
              <Text tone="secondary" className="text-sm">
                Created
              </Text>
              <Text>
                {new Date(workspace.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </div>
        </Card>

        {/* Members */}
        <Card padding="lg">
          <Heading as="h3" size="h4" className="mb-4">
            Members ({members?.length || 0})
          </Heading>
          {membersLoading ? (
            <div className="flex justify-center py-8">
              <Spinner label="Loading members…" />
            </div>
          ) : membersError ? (
            <Text tone="secondary">Failed to load members</Text>
          ) : (
            <div className="space-y-3">
              {members?.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between rounded-lg border border-divider p-3"
                >
                  <div>
                    <Text className="font-medium">
                      {member.firstName} {member.lastName}
                    </Text>
                    <Text tone="secondary" className="text-sm">
                      {member.email}
                    </Text>
                  </div>
                  <Chip
                    variant={
                      member.role === WorkspaceRole.OWNER
                        ? 'primary'
                        : member.role === WorkspaceRole.ADMIN
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {member.role}
                  </Chip>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card padding="lg" className="max-w-md">
            <Heading as="h3" size="h4" className="text-danger">
              Delete Workspace?
            </Heading>
            <Text className="mt-2">
              This action cannot be undone. All projects and tasks in this
              workspace will be permanently deleted.
            </Text>
            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                onPress={() => setShowDeleteConfirm(false)}
                isDisabled={deleteWorkspace.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onPress={handleDelete}
                loading={deleteWorkspace.isPending}
              >
                Delete Workspace
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
