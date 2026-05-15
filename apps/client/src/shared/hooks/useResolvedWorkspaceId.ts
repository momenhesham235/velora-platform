import { useParams } from 'react-router-dom';
import { useWorkspaceStore } from '@/store/workspace.store';

/**
 * Resolves workspace ID from route params (:workspaceId or :id) or Zustand active workspace.
 */
export function useResolvedWorkspaceId(): string | null {
  const { workspaceId, id } = useParams<{
    workspaceId?: string;
    id?: string;
  }>();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  return workspaceId ?? id ?? activeWorkspaceId;
}
