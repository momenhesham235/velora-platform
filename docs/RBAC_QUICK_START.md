# RBAC Quick Start Guide

## Problem Solved

**Error**: `"Workspace ID is required"` when calling workspace endpoints from frontend.

**Root Cause**: The RBAC middleware was looking for `req.params.workspaceId`, but workspace routes use `req.params.id` as the parameter name (e.g., `/api/workspaces/:id`).

**Solution**: Updated `extractWorkspaceId()` function in `rbac.middleware.ts` to check both `req.params.workspaceId` and `req.params.id`.

---

## How RBAC Works

### 1. **Workspace ID Extraction**

The RBAC middleware automatically extracts the workspace ID from:
1. `req.params.workspaceId` (e.g., `/api/workspaces/:workspaceId/projects`)
2. `req.params.id` (e.g., `/api/workspaces/:id`)
3. `req.body.workspaceId`
4. `req.query.workspaceId`

### 2. **Route Protection**

```typescript
// Example: Workspace routes
router.get(
  '/:id',                           // ✅ :id is automatically detected
  authenticate,                      // Step 1: Verify user is logged in
  requireWorkspaceMember(),          // Step 2: Verify user is workspace member
  WorkspaceController.getWorkspaceById
);

router.patch(
  '/:id',
  authenticate,
  requirePermission(Permission.WORKSPACE_UPDATE),  // Checks permission
  WorkspaceController.updateWorkspace
);
```

### 3. **Workspace Context**

After RBAC middleware runs, `req.workspaceContext` is available:

```typescript
interface WorkspaceContext {
  workspaceId: string;
  userId: string;
  userRole: WorkspaceRole;  // OWNER | ADMIN | MEMBER | VIEWER
}

// Use in controller
export class ProjectController {
  static async list(req: Request, res: Response) {
    const { workspaceId, userRole } = req.workspaceContext!;
    
    // Fetch projects scoped to this workspace
    const projects = await Project.find({ workspaceId });
    
    return successResponse(res, 'Projects retrieved', projects);
  }
}
```

---

## Common Patterns

### Pattern 1: Workspace-Scoped Resources

For resources that belong to a workspace (projects, tasks, etc.):

**Route Structure**: `/api/workspaces/:workspaceId/projects`

```typescript
// routes/project.routes.ts
router.get(
  '/:workspaceId/projects',
  authenticate,
  requireWorkspaceMember(),  // Just verify membership
  ProjectController.list
);

router.post(
  '/:workspaceId/projects',
  authenticate,
  requirePermission(Permission.PROJECT_CREATE),
  ProjectController.create
);

router.patch(
  '/:workspaceId/projects/:projectId',
  authenticate,
  requirePermission(Permission.PROJECT_UPDATE),
  ProjectController.update
);

router.delete(
  '/:workspaceId/projects/:projectId',
  authenticate,
  requirePermission(Permission.PROJECT_DELETE),
  ProjectController.delete
);
```

### Pattern 2: Direct Workspace Operations

For operations on the workspace itself:

**Route Structure**: `/api/workspaces/:id`

```typescript
// routes/workspace.routes.ts
router.get(
  '/:id',
  authenticate,
  requireWorkspaceMember(),  // ✅ :id is detected as workspaceId
  WorkspaceController.getById
);

router.patch(
  '/:id',
  authenticate,
  requirePermission(Permission.WORKSPACE_UPDATE),
  WorkspaceController.update
);
```

### Pattern 3: Multiple Permission Options

When a user needs ANY of several permissions:

```typescript
router.patch(
  '/:workspaceId/tasks/:taskId',
  authenticate,
  requireAnyPermission([
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE
  ]),
  TaskController.update
);
```

### Pattern 4: Role-Based Access

When you need to check specific roles:

```typescript
router.post(
  '/:workspaceId/settings',
  authenticate,
  requireAnyWorkspaceRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN]),
  SettingsController.update
);
```

---

## Frontend Integration

### 1. **API Endpoints**

```typescript
// services/api/endpoints.ts
export const API_ENDPOINTS = {
  WORKSPACES: {
    BASE: '/workspaces',
    BY_ID: (id: string) => `/workspaces/${id}`,
    MEMBERS: (id: string) => `/workspaces/${id}/members`,
    MEMBER_BY_ID: (workspaceId: string, userId: string) => 
      `/workspaces/${workspaceId}/members/${userId}`,
  },
  PROJECTS: {
    LIST: (workspaceId: string) => `/workspaces/${workspaceId}/projects`,
    BY_ID: (workspaceId: string, projectId: string) => 
      `/workspaces/${workspaceId}/projects/${projectId}`,
  },
};
```

### 2. **API Calls**

```typescript
// features/projects/api/projects.api.ts
export const projectsApi = {
  list: (workspaceId: string): Promise<Project[]> =>
    http.get<Project[]>(API_ENDPOINTS.PROJECTS.LIST(workspaceId)),
  
  create: (workspaceId: string, data: CreateProjectInput): Promise<Project> =>
    http.post<Project, CreateProjectInput>(
      API_ENDPOINTS.PROJECTS.LIST(workspaceId),
      data
    ),
  
  update: (
    workspaceId: string,
    projectId: string,
    data: UpdateProjectInput
  ): Promise<Project> =>
    http.patch<Project, UpdateProjectInput>(
      API_ENDPOINTS.PROJECTS.BY_ID(workspaceId, projectId),
      data
    ),
};
```

### 3. **React Hooks**

```typescript
// features/projects/hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';

export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => projectsApi.list(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProjectInput) => 
      projectsApi.create(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects', workspaceId]);
    },
  });
}
```

### 4. **UI Components**

```typescript
// features/projects/components/ProjectList.tsx
export function ProjectList({ workspaceId }: { workspaceId: string }) {
  const { data: projects, isLoading } = useProjects(workspaceId);
  const createProject = useCreateProject(workspaceId);
  
  const handleCreate = async (data: CreateProjectInput) => {
    try {
      await createProject.mutateAsync(data);
      toast.success('Project created');
    } catch (error) {
      if (error.statusCode === 403) {
        toast.error('You do not have permission to create projects');
      } else {
        toast.error('Failed to create project');
      }
    }
  };
  
  // ... render UI
}
```

---

## Error Handling

### Backend Errors

```typescript
// RBAC middleware throws these errors:
{
  "success": false,
  "message": "Workspace ID is required",
  "statusCode": 400
}

{
  "success": false,
  "message": "You are not a member of this workspace",
  "statusCode": 403
}

{
  "success": false,
  "message": "You do not have permission to perform this action (project:create)",
  "statusCode": 403
}
```

### Frontend Error Handling

```typescript
// services/api/client.ts
try {
  const result = await projectsApi.create(workspaceId, data);
  return result;
} catch (error) {
  if (error.statusCode === 403) {
    // Permission denied
    toast.error(error.message);
  } else if (error.statusCode === 404) {
    // Workspace not found
    toast.error('Workspace not found');
  } else {
    // Generic error
    toast.error('An error occurred');
  }
  throw error;
}
```

---

## Testing RBAC

### 1. **Test Different Roles**

```typescript
describe('Project Creation', () => {
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
    expect(response.body.message).toContain('permission');
  });
});
```

### 2. **Test Workspace Isolation**

```typescript
it('should not allow access to other workspace resources', async () => {
  const response = await request(app)
    .get(`/api/workspaces/${otherWorkspaceId}/projects`)
    .set('Authorization', `Bearer ${userToken}`);
  
  expect(response.status).toBe(403);
  expect(response.body.message).toContain('not a member');
});
```

---

## Checklist for New Features

When adding a new workspace-scoped feature:

- [ ] **1. Define permissions** in `packages/types/src/rbac.types.ts`
  ```typescript
  export enum Permission {
    FEATURE_VIEW = 'feature:view',
    FEATURE_CREATE = 'feature:create',
    FEATURE_UPDATE = 'feature:update',
    FEATURE_DELETE = 'feature:delete',
  }
  ```

- [ ] **2. Update role permissions** in `apps/server/src/core/rbac/permissions.ts`
  ```typescript
  [WorkspaceRole.MEMBER]: [
    // ... existing
    Permission.FEATURE_VIEW,
    Permission.FEATURE_CREATE,
  ],
  ```

- [ ] **3. Create model** with workspace reference
  ```typescript
  const featureSchema = new Schema({
    workspaceId: { type: String, required: true, ref: 'Workspace' },
    // ... other fields
  });
  ```

- [ ] **4. Apply RBAC middleware** to routes
  ```typescript
  router.get(
    '/:workspaceId/features',
    authenticate,
    requireWorkspaceMember(),
    FeatureController.list
  );
  ```

- [ ] **5. Use workspace context** in controller
  ```typescript
  const { workspaceId } = req.workspaceContext!;
  const features = await Feature.find({ workspaceId });
  ```

- [ ] **6. Create frontend API** with workspace ID
  ```typescript
  list: (workspaceId: string) => 
    http.get(`/workspaces/${workspaceId}/features`)
  ```

- [ ] **7. Test permissions** for all roles

---

## Troubleshooting

### Issue: "Workspace ID is required"

**Cause**: Workspace ID not found in request

**Solutions**:
1. Ensure route parameter is `:id` or `:workspaceId`
2. Check frontend is sending workspace ID in URL
3. Verify middleware order (authenticate → RBAC → controller)

### Issue: "You are not a member of this workspace"

**Cause**: User is not in workspace members array

**Solutions**:
1. Check user was added to workspace
2. Verify workspace ID is correct
3. Check database for workspace membership

### Issue: "You do not have permission..."

**Cause**: User's role doesn't have required permission

**Solutions**:
1. Check user's role in workspace
2. Verify permission is assigned to role in `permissions.ts`
3. Consider if user needs role upgrade

---

## Next Steps

1. ✅ RBAC system is implemented
2. ✅ Workspace routes are protected
3. 🔄 Add RBAC to Projects module (next)
4. 🔄 Add RBAC to Tasks module
5. 🔄 Add permission checks in frontend UI
6. 🔄 Add role management UI
7. 🔄 Add audit logging

---

## Support

For questions or issues:
- Check `docs/RBAC_ARCHITECTURE.md` for detailed architecture
- Review permission matrix for role capabilities
- Test with different roles using Postman/Thunder Client
