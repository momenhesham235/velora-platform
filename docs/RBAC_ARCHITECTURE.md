# RBAC Architecture Documentation

## Overview

Velora implements a **workspace-scoped Role-Based Access Control (RBAC)** system. Unlike traditional global roles, each user has a specific role **per workspace**, enabling fine-grained access control across multi-tenant workspaces.

## Architecture Principles

### 1. **Workspace-Scoped Roles**
- Roles are NOT global on the user
- Each user has a role PER workspace (via `WorkspaceMember`)
- A user can be an OWNER in one workspace and a VIEWER in another

### 2. **Monorepo Type System**
```
packages/types/          → Shared TypeScript contracts (NO logic)
  ├── auth.types.ts      → Authentication types
  ├── workspace.types.ts → Workspace & member types
  └── rbac.types.ts      → Permission & RBAC types

apps/server/             → Backend business logic
  ├── core/rbac/         → RBAC engine & middleware
  └── modules/           → Feature modules

apps/client/             → Frontend application
```

### 3. **Permission Model**

#### Roles Hierarchy
```
OWNER   → Full control (delete workspace, manage everything)
ADMIN   → Management (add/remove members, manage projects/tasks)
MEMBER  → Contribute (create/edit own content, view projects)
VIEWER  → Read-only (view workspace content)
```

#### Permission Categories
- **Workspace**: `workspace:view`, `workspace:update`, `workspace:delete`, `workspace:manage_members`
- **Project**: `project:view`, `project:create`, `project:update`, `project:delete`
- **Task**: `task:view`, `task:create`, `task:update`, `task:delete`, `task:assign`
- **Member**: `member:view`, `member:invite`, `member:remove`, `member:update_role`

## Implementation

### Core RBAC System (`apps/server/src/core/rbac/`)

#### 1. **permissions.ts** - Permission Definitions
```typescript
import { Permission, WorkspaceRole } from '@velora/types';

export const ROLE_PERMISSIONS: RolePermissions = {
  [WorkspaceRole.OWNER]: [
    Permission.WORKSPACE_VIEW,
    Permission.WORKSPACE_UPDATE,
    Permission.WORKSPACE_DELETE,
    // ... all permissions
  ],
  [WorkspaceRole.ADMIN]: [
    Permission.WORKSPACE_VIEW,
    Permission.WORKSPACE_UPDATE,
    // ... management permissions
  ],
  // ...
};
```

#### 2. **rbac.service.ts** - Permission Checking Engine
```typescript
export class RBACService {
  // Get user's role in workspace
  static async getUserWorkspaceRole(workspaceId: string, userId: string): Promise<WorkspaceRole | null>
  
  // Check if user has permission
  static async hasPermission(workspaceId: string, userId: string, permission: Permission): Promise<boolean>
  
  // Require permission (throws error if not allowed)
  static async requirePermission(workspaceId: string, userId: string, permission: Permission): Promise<void>
  
  // Check role hierarchy for member management
  static async canManageMember(workspaceId: string, actorUserId: string, targetUserId: string): Promise<boolean>
}
```

#### 3. **rbac.middleware.ts** - Express Middleware
```typescript
// Require specific permission
export function requirePermission(permission: Permission)

// Require any of multiple permissions
export function requireAnyPermission(permissions: Permission[])

// Require specific role
export function requireWorkspaceRole(role: WorkspaceRole)

// Ensure user is workspace member
export function requireWorkspaceMember()
```

### Usage in Routes

```typescript
import { requirePermission, requireWorkspaceMember } from '@core/rbac';
import { Permission } from '@velora/types';

// Require workspace membership
router.get(
  '/:workspaceId/projects',
  authenticate,
  requireWorkspaceMember(),
  ProjectController.list
);

// Require specific permission
router.post(
  '/:workspaceId/projects',
  authenticate,
  requirePermission(Permission.PROJECT_CREATE),
  ProjectController.create
);

// Require any of multiple permissions
router.patch(
  '/:workspaceId/projects/:id',
  authenticate,
  requireAnyPermission([Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE]),
  ProjectController.update
);
```

### Workspace Context

The RBAC middleware automatically attaches workspace context to the request:

```typescript
// In Express request
interface Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
  workspaceContext?: {
    workspaceId: string;
    userId: string;
    userRole: WorkspaceRole;
  };
}

// Access in controller
export class ProjectController {
  static async create(req: Request, res: Response) {
    const { workspaceId, userRole } = req.workspaceContext!;
    // ... use workspace context
  }
}
```

## Permission Matrix

| Action | OWNER | ADMIN | MEMBER | VIEWER |
|--------|-------|-------|--------|--------|
| **Workspace** |
| View workspace | ✅ | ✅ | ✅ | ✅ |
| Update workspace | ✅ | ✅ | ❌ | ❌ |
| Delete workspace | ✅ | ❌ | ❌ | ❌ |
| Manage members | ✅ | ✅ | ❌ | ❌ |
| **Projects** |
| View projects | ✅ | ✅ | ✅ | ✅ |
| Create project | ✅ | ✅ | ✅ | ❌ |
| Update project | ✅ | ✅ | ❌ | ❌ |
| Delete project | ✅ | ✅ | ❌ | ❌ |
| **Tasks** |
| View tasks | ✅ | ✅ | ✅ | ✅ |
| Create task | ✅ | ✅ | ✅ | ❌ |
| Update task | ✅ | ✅ | ✅ | ❌ |
| Delete task | ✅ | ✅ | ❌ | ❌ |
| Assign task | ✅ | ✅ | ❌ | ❌ |
| **Members** |
| View members | ✅ | ✅ | ✅ | ✅ |
| Invite member | ✅ | ✅ | ❌ | ❌ |
| Remove member | ✅ | ✅ | ❌ | ❌ |
| Update role | ✅ | ❌ | ❌ | ❌ |

## Data Model

### Workspace Model
```typescript
interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;  // OWNER | ADMIN | MEMBER | VIEWER
  joinedAt: Date;
}
```

### Role Resolution Flow
```
1. Request comes in with workspaceId (params/body/query)
2. RBAC middleware extracts workspaceId
3. RBACService.getUserWorkspaceRole(workspaceId, userId)
4. Check if user is member → get role
5. Check if role has required permission
6. Attach workspaceContext to request
7. Continue to controller
```

## Best Practices

### 1. **Always Use Workspace Context**
```typescript
// ❌ Bad - bypassing RBAC
const projects = await Project.find({ userId: req.user.id });

// ✅ Good - respecting workspace scope
const { workspaceId } = req.workspaceContext!;
const projects = await Project.find({ workspaceId });
```

### 2. **Use Appropriate Middleware**
```typescript
// For simple membership check
requireWorkspaceMember()

// For specific permission
requirePermission(Permission.PROJECT_CREATE)

// For multiple permissions (OR logic)
requireAnyPermission([Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE])

// For role-based check
requireWorkspaceRole(WorkspaceRole.ADMIN)
```

### 3. **Type Safety**
```typescript
// Always import from @velora/types
import { Permission, WorkspaceRole } from '@velora/types';

// Never hardcode strings
requirePermission('project:create') // ❌ Bad
requirePermission(Permission.PROJECT_CREATE) // ✅ Good
```

### 4. **Service Layer Checks**
```typescript
// Even with middleware, validate in service layer
export class ProjectService {
  static async delete(projectId: string, userId: string, workspaceId: string) {
    // Additional business logic checks
    const project = await Project.findById(projectId);
    
    if (project.workspaceId !== workspaceId) {
      throw ApiError.forbidden('Project does not belong to this workspace');
    }
    
    // ... proceed with deletion
  }
}
```

## Migration Guide

### Adding RBAC to New Modules

1. **Define permissions in `packages/types/src/rbac.types.ts`**
```typescript
export enum Permission {
  // ... existing
  DOCUMENT_VIEW = 'document:view',
  DOCUMENT_CREATE = 'document:create',
}
```

2. **Update role permissions in `apps/server/src/core/rbac/permissions.ts`**
```typescript
export const ROLE_PERMISSIONS: RolePermissions = {
  [WorkspaceRole.OWNER]: [
    // ... existing
    Permission.DOCUMENT_VIEW,
    Permission.DOCUMENT_CREATE,
  ],
  // ... other roles
};
```

3. **Apply middleware to routes**
```typescript
router.post(
  '/:workspaceId/documents',
  authenticate,
  requirePermission(Permission.DOCUMENT_CREATE),
  DocumentController.create
);
```

4. **Use workspace context in controller**
```typescript
export class DocumentController {
  static async create(req: Request, res: Response) {
    const { workspaceId, userId } = req.workspaceContext!;
    // ... create document in workspace
  }
}
```

## Testing RBAC

### Unit Tests
```typescript
describe('RBACService', () => {
  it('should allow OWNER to delete workspace', async () => {
    const hasPermission = await RBACService.hasPermission(
      workspaceId,
      ownerId,
      Permission.WORKSPACE_DELETE
    );
    expect(hasPermission).toBe(true);
  });
  
  it('should deny MEMBER from deleting workspace', async () => {
    const hasPermission = await RBACService.hasPermission(
      workspaceId,
      memberId,
      Permission.WORKSPACE_DELETE
    );
    expect(hasPermission).toBe(false);
  });
});
```

### Integration Tests
```typescript
describe('POST /api/workspaces/:id/projects', () => {
  it('should allow MEMBER to create project', async () => {
    const response = await request(app)
      .post(`/api/workspaces/${workspaceId}/projects`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ name: 'New Project' });
    
    expect(response.status).toBe(201);
  });
  
  it('should deny VIEWER from creating project', async () => {
    const response = await request(app)
      .post(`/api/workspaces/${workspaceId}/projects`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ name: 'New Project' });
    
    expect(response.status).toBe(403);
  });
});
```

## Security Considerations

1. **Always validate workspace ownership** - Ensure resources belong to the workspace
2. **Check role hierarchy** - ADMIN cannot manage OWNER
3. **Audit logging** - Log permission checks and role changes
4. **Rate limiting** - Prevent permission enumeration attacks
5. **Workspace isolation** - Never leak data across workspaces

## Future Enhancements

- [ ] Custom roles per workspace
- [ ] Permission inheritance
- [ ] Resource-level permissions (e.g., task ownership)
- [ ] Temporary role assignments
- [ ] Permission audit logs
- [ ] Role templates
