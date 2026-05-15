import { describe, it, expect } from 'vitest';
import { Permission, WorkspaceRole } from '@velora/types';
import {
  roleHasPermission,
  canManageRole,
  getRolePermissions,
} from '../permissions';

describe('RBAC permissions', () => {
  it('owner has workspace delete permission', () => {
    expect(
      roleHasPermission(WorkspaceRole.OWNER, Permission.WORKSPACE_DELETE)
    ).toBe(true);
  });

  it('viewer cannot create projects', () => {
    expect(
      roleHasPermission(WorkspaceRole.VIEWER, Permission.PROJECT_CREATE)
    ).toBe(false);
  });

  it('admin can invite members but not update roles', () => {
    expect(
      roleHasPermission(WorkspaceRole.ADMIN, Permission.MEMBER_INVITE)
    ).toBe(true);
    expect(
      roleHasPermission(WorkspaceRole.ADMIN, Permission.MEMBER_UPDATE_ROLE)
    ).toBe(false);
  });

  it('role hierarchy allows owner to manage admin', () => {
    expect(canManageRole(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)).toBe(true);
    expect(canManageRole(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)).toBe(false);
    expect(canManageRole(WorkspaceRole.MEMBER, WorkspaceRole.ADMIN)).toBe(
      false
    );
  });

  it('returns permissions list for member role', () => {
    const perms = getRolePermissions(WorkspaceRole.MEMBER);
    expect(perms).toContain(Permission.TASK_CREATE);
    expect(perms).not.toContain(Permission.WORKSPACE_DELETE);
  });
});
