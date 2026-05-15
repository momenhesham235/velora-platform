import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { AuthSync } from '@/features/auth/components/AuthSync';
import { WorkspaceProvider } from '@/app/providers/WorkspaceProvider';

export function AppRouter() {
  const publicRoutes = routes.filter((r) => !r.protected);
  const protectedRoutes = routes.filter((r) => r.protected);

  return (
    <BrowserRouter>
      <WorkspaceProvider>
        {/* Bridges authEvents → store + queryClient + navigate. Renders null. */}
        <AuthSync />
        <Routes>
          {publicRoutes.map((route) => {
            const Element = route.element;
            return (
              <Route key={route.path} path={route.path} element={<Element />} />
            );
          })}

          {/* All protected routes render inside the app shell */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {protectedRoutes.map((route) => {
              const Element = route.element;
              return (
                <Route key={route.path} path={route.path} element={<Element />} />
              );
            })}
          </Route>
        </Routes>
      </WorkspaceProvider>
    </BrowserRouter>
  );
}
