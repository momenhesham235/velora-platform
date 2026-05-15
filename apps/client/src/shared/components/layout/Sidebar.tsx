import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrandMark } from '@/shared/components/branding/BrandMark';
import { ROUTES } from '@/shared/constants';

interface SidebarProps {
  /** Whether the sidebar drawer is open on mobile */
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: () => JSX.Element;
}

const NAV: NavItem[] = [
  { label: 'Dashboard',  to: ROUTES.DASHBOARD,  icon: DashboardIcon  },
  { label: 'Workspaces', to: ROUTES.WORKSPACES, icon: WorkspaceIcon },
  { label: 'Projects',   to: ROUTES.PROJECTS,   icon: ProjectIcon   },
  { label: 'Tasks',      to: ROUTES.TASKS,      icon: TaskIcon      },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile scrim */}
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-divider bg-content1 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-divider px-5">
          <BrandMark size="md" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.DASHBOARD}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-foreground'
                    : 'text-default-500 hover:bg-content2 hover:text-foreground',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-divider p-4">
          <div className="rounded-lg border border-divider bg-content2/60 p-3">
            <div className="text-xs font-medium text-foreground">
              Velora Free
            </div>
            <div className="mt-1 text-xs text-default-500">
              You&apos;re on the free plan. Upgrade anytime.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M3 3h6v6H3V3Zm0 8h6v6H3v-6Zm8-8h6v6h-6V3Zm0 8h6v6h-6v-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function WorkspaceIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M3 7l7-4 7 4-7 4-7-4Zm0 5 7 4 7-4M3 12v3l7 4 7-4v-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ProjectIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M3 6a2 2 0 0 1 2-2h3l2 2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TaskIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M6 7h10M6 11h10M6 15h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="2.5"
        y="3.5"
        width="15"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
