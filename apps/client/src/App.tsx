import { HeroUIProvider } from '@heroui/react';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { AppRouter } from '@/app/router/AppRouter';

/**
 * Provider order matters:
 *  HeroUI → Query → Theme → Router(+ AuthSync inside)
 *
 * AuthProvider is intentionally absent — auth state now lives in the Zustand
 * store (`src/store/auth.store.ts`) with the User object served by TanStack
 * Query (`authKeys.me()`). The bridge between the framework-free networking
 * layer and React happens in <AuthSync/>, which is mounted inside AppRouter
 * (it needs both useNavigate and useQueryClient).
 */
function App() {
  return (
    <HeroUIProvider>
      <QueryProvider>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </QueryProvider>
    </HeroUIProvider>
  );
}

export default App;
