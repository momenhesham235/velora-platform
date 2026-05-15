import type { InternalAxiosRequestConfig } from 'axios';
import { useWorkspaceStore } from '@/store/workspace.store';

/**
 * Attach active workspace ID header for workspace-scoped APIs
 */
export function workspaceInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
  if (workspaceId && config.headers) {
    config.headers['X-Workspace-Id'] = workspaceId;
  }
  return config;
}
