export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  WORKSPACES: {
    BASE: '/workspaces',
    BY_ID: (id: string) => `/workspaces/${id}`,
    ME: (id: string) => `/workspaces/${id}/me`,
    MEMBERS: (id: string) => `/workspaces/${id}/members`,
    MEMBER_BY_ID: (workspaceId: string, userId: string) =>
      `/workspaces/${workspaceId}/members/${userId}`,
    ACTIVITY: (id: string) => `/workspaces/${id}/activity`,
    PROJECTS: (workspaceId: string) =>
      `/workspaces/${workspaceId}/projects`,
    PROJECT_BY_ID: (workspaceId: string, projectId: string) =>
      `/workspaces/${workspaceId}/projects/${projectId}`,
    TASKS: (workspaceId: string) => `/workspaces/${workspaceId}/tasks`,
    TASK_BY_ID: (workspaceId: string, taskId: string) =>
      `/workspaces/${workspaceId}/tasks/${taskId}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
} as const;
