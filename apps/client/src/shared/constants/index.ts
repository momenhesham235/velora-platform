export const APP_NAME = 'Velora Platform';
export const APP_VERSION = '1.1.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  WORKSPACES: '/workspaces',
  PROJECTS: '/projects',
  TASKS: '/tasks',
} as const;

export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
  },
  USERS: {
    ALL: ['users'],
    BY_ID: (id: string) => ['users', id],
  },
  WORKSPACES: {
    ALL: ['workspaces'],
    BY_ID: (id: string) => ['workspaces', id],
  },
  PROJECTS: {
    ALL: ['projects'],
    BY_ID: (id: string) => ['projects', id],
  },
  TASKS: {
    ALL: ['tasks'],
    BY_ID: (id: string) => ['tasks', id],
  },
} as const;
