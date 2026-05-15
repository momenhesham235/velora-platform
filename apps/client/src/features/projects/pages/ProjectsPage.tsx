import { Button, Card, Heading, Text } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Projects"
        title="Projects"
        description="Group related tasks, sprints and milestones under a single project."
        actions={<Button variant="primary">+ New project</Button>}
      />

      <Card padding="none" className="border-dashed">
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
              <path
                d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Heading as="h2" size="h3">No projects yet</Heading>
          <Text tone="secondary" className="max-w-md">
            Spin up your first project to start grouping tasks, assigning
            owners and tracking progress.
          </Text>
          <Button variant="primary" className="mt-2">
            + New project
          </Button>
        </div>
      </Card>
    </div>
  );
}
