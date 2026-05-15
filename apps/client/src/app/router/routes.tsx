import { ComponentType } from 'react';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { EmailVerificationPage } from '@/features/auth/pages/EmailVerificationPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { WorkspacesPage } from '@/features/workspaces/pages/WorkspacesPage';
import { WorkspaceDetailPage } from '@/features/workspaces/pages/WorkspaceDetailPage';
import { ProjectsPage } from '@/features/projects/pages/ProjectsPage';
import { TasksPage } from '@/features/tasks/pages/TasksPage';
import { ROUTES } from '@/shared/constants';

export interface RouteConfig {
  path: string;
  element: ComponentType;
  protected?: boolean;
}

export const routes: RouteConfig[] = [
  // Public / auth
  { path: ROUTES.LOGIN,           element: LoginPage,             protected: false },
  { path: ROUTES.REGISTER,        element: RegisterPage,          protected: false },
  { path: ROUTES.FORGOT_PASSWORD, element: ForgotPasswordPage,    protected: false },
  { path: ROUTES.VERIFY_EMAIL,    element: EmailVerificationPage, protected: false },

  // Protected — rendered inside MainLayout (sidebar + topbar)
  { path: ROUTES.HOME,             element: DashboardPage,        protected: true },
  { path: ROUTES.DASHBOARD,        element: DashboardPage,        protected: true },
  { path: ROUTES.WORKSPACES,       element: WorkspacesPage,       protected: true },
  { path: ROUTES.WORKSPACE_DETAIL, element: WorkspaceDetailPage,  protected: true },
  { path: ROUTES.PROJECTS,         element: ProjectsPage,         protected: true },
  { path: ROUTES.TASKS,            element: TasksPage,            protected: true },
];
