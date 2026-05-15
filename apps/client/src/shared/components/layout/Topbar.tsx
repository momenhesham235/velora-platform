import { Avatar, Button, Input, Kbd, Menu } from '@/shared/components/ui';
import { WorkspaceSwitcher } from '@/shared/components/layout/WorkspaceSwitcher';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { getFullName } from '@/types/global.types';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const { user } = useAuth();
  const logout = useLogout();

  const displayName = user ? getFullName(user) : 'Guest';
  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : 'V';

  // The mutation's onSettled emits session:expired; <AuthSync/> handles
  // store clear, queryClient.clear(), and the navigation to /login.
  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-divider bg-background/85 px-4 backdrop-blur sm:px-6">
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={onOpenSidebar}
        aria-label="Open menu"
        className="lg:hidden"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Button>

      <div className="hidden flex-1 md:flex">
        <Input
          aria-label="Search"
          placeholder="Search workspaces, projects, tasks…"
          variant="outline"
          size="sm"
          className="max-w-md"
          startContent={
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-default-500" aria-hidden>
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="m14 14 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          endContent={<Kbd keys={['command']}>K</Kbd>}
        />
      </div>

      <WorkspaceSwitcher />

      <div className="ml-auto flex items-center gap-2">
        <Button
          isIconOnly
          variant="secondary"
          size="sm"
          aria-label="Notifications"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M5 8a5 5 0 0 1 10 0v3l1.5 2.5h-13L5 11V8Zm3 7a2 2 0 0 0 4 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </Button>

        <Menu placement="bottom-end">
          <Menu.Trigger>
            <button
              className="flex items-center gap-2 rounded-lg border border-divider bg-content1 px-1.5 py-1 text-sm transition-colors hover:bg-content2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Account menu"
            >
              <Avatar size="sm" name={initials} />
              <span className="hidden pr-2 text-foreground sm:inline">
                {displayName}
              </span>
            </button>
          </Menu.Trigger>
          <Menu.Content aria-label="Account menu">
            <Menu.Item
              key="profile"
              isReadOnly
              className="opacity-100 cursor-default"
              classNames={{ base: 'data-[hover=true]:bg-transparent' }}
            >
              <div className="text-sm font-medium text-foreground">{displayName}</div>
              <div className="text-xs text-default-500">{user?.email}</div>
            </Menu.Item>
            <Menu.Item key="settings" textValue="Settings">Settings</Menu.Item>
            <Menu.Item
              key="logout"
              textValue="Logout"
              color="danger"
              className="text-danger"
              onPress={handleLogout}
            >
              Sign out
            </Menu.Item>
          </Menu.Content>
        </Menu>
      </div>
    </header>
  );
}
