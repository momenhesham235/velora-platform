import { useNavigate } from 'react-router-dom';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import { useWorkspaceStore } from '@/store/workspace.store';
import { workspaceRoute } from '@/shared/constants';
import { Text } from '@/shared/components/ui';

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { data: workspaces = [], isPending } = useWorkspaces();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setActiveWorkspaceId(null);
      return;
    }
    setActiveWorkspaceId(value);
    navigate(workspaceRoute.projects(value));
  };

  if (isPending) {
    return (
      <Text tone="secondary" className="hidden text-sm sm:block">
        Loading workspaces…
      </Text>
    );
  }

  return (
    <label className="hidden items-center gap-2 sm:flex">
      <span className="text-xs font-medium text-default-500">Workspace</span>
      <select
        value={activeWorkspaceId ?? ''}
        onChange={handleChange}
        className="max-w-[180px] rounded-lg border border-divider bg-content1 px-2 py-1.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Active workspace"
      >
        <option value="">Select workspace…</option>
        {workspaces.map((ws) => (
          <option key={ws.id} value={ws.id}>
            {ws.name}
          </option>
        ))}
      </select>
    </label>
  );
}
