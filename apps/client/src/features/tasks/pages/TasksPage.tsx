import { Button, Card, Heading, Text } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export function TasksPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Tasks"
        title="My tasks"
        description="Every task assigned to or watched by you, across all projects."
        actions={<Button variant="primary">+ New task</Button>}
      />

      <Card padding="none" className="border-dashed">
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
              <rect
                x="3.5"
                y="4.5"
                width="17"
                height="15"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 9h8M8 13h8M8 17h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <Heading as="h2" size="h3">Inbox zero</Heading>
          <Text tone="secondary" className="max-w-md">
            You don&apos;t have any tasks yet. Create one to start tracking
            your work — or wait to be assigned one.
          </Text>
          <Button variant="primary" className="mt-2">
            + New task
          </Button>
        </div>
      </Card>
    </div>
  );
}
