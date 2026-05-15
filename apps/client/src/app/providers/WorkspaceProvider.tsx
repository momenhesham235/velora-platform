import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useMatch } from 'react-router-dom';
import { useWorkspaceStore } from '@/store/workspace.store';

interface WorkspaceContextValue {
  workspaceId: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspaceId: null,
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const matchById = useMatch('/workspaces/:id');
  const matchByWorkspaceId = useMatch('/workspaces/:workspaceId/*');
  const workspaceId =
    matchById?.params?.id ??
    matchByWorkspaceId?.params?.workspaceId ??
    null;
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);

  useEffect(() => {
    setActiveWorkspaceId(workspaceId);
    return () => setActiveWorkspaceId(null);
  }, [workspaceId, setActiveWorkspaceId]);

  return (
    <WorkspaceContext.Provider value={{ workspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}
