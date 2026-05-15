import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Heading,
  Progress,
  Text,
} from "@/shared/components/ui";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getFullName } from "@/types/global.types";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { ROUTES } from "@/shared/constants";

export function DashboardPage() {
  const { user } = useAuth();
  const displayName = user ? getFullName(user) : "there";
  const firstName = user?.firstName ?? "there";
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "V";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Overview"
        title={`Good to see you, ${firstName}.`}
        description="Here's a snapshot of what's moving in your workspace today."
        actions={
          <>
            <Link to={ROUTES.PROJECTS}>
              <Button variant="secondary">View projects</Button>
            </Link>
            <Link to={ROUTES.TASKS}>
              <Button variant="primary">+ New task</Button>
            </Link>
          </>
        }
      />

      {/* Stat grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value="0" trend="—" />
        <StatCard label="Open tasks" value="0" trend="—" />
        <StatCard label="Completed this week" value="0" trend="—" />
        <StatCard label="Workspace members" value="2" trend="just you" />
      </div>

      {/* Two-column body */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card padding="none" className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-divider px-5 py-4">
            <div>
              <Heading as="h2" size="h3">
                Today&apos;s focus
              </Heading>
              <Text
                variant="caption"
                tone="secondary"
                className="!normal-case !tracking-normal mt-0.5"
              >
                Tasks you flagged for today
              </Text>
            </div>
            <Chip tone="primary">0 pending</Chip>
          </div>
          <div className="px-5 py-8">
            <EmptyState
              title="No tasks for today yet"
              description="Create your first task or pick one up from an existing project to start tracking your focus."
              actionLabel="Create task"
            />
          </div>
        </Card>

        <Card padding="none">
          <div className="border-b border-divider px-5 py-4">
            <Heading as="h2" size="h3">
              Your profile
            </Heading>
          </div>
          <div className="space-y-5 px-5 py-5">
            <div className="flex items-center gap-3">
              <Avatar size="lg" name={initials} />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">
                  {displayName}
                </div>
                <div className="truncate text-xs text-default-500">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <Row label="Role" value={<Chip>{user?.role ?? "user"}</Chip>} />
              <Row
                label="Email verified"
                value={
                  user?.isEmailVerified ? (
                    <Chip tone="success">Verified</Chip>
                  ) : (
                    <Chip tone="warning">Pending</Chip>
                  )
                }
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-default-500">
                <span>Workspace setup</span>
                <span>25%</span>
              </div>
              <Progress aria-label="Workspace setup progress" value={25} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <Card className="transition-colors hover:border-default-400">
      <div className="space-y-1">
        <div className="text-xs font-medium uppercase tracking-wider text-default-500">
          {label}
        </div>
        <div className="text-display font-semibold tracking-tight text-foreground">
          {value}
        </div>
        <div className="text-xs text-default-500">{trend}</div>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-default-500">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
}: {
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-content2 text-default-500">
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
          <path
            d="M10 4v12M4 10h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <p className="max-w-sm text-xs text-default-500">{description}</p>
      <Button size="sm" variant="primary" className="mt-1">
        {actionLabel}
      </Button>
    </div>
  );
}
