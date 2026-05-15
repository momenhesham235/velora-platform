import { Link } from 'react-router-dom';
import { Button, Card, Heading, Text } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';

interface SelectWorkspacePromptProps {
  resourceLabel: string;
}

export function SelectWorkspacePrompt({ resourceLabel }: SelectWorkspacePromptProps) {
  return (
    <Card padding="lg" className="border-dashed">
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Heading as="h2" size="h3">
          Select a workspace
        </Heading>
        <Text tone="secondary" className="max-w-md">
          Choose a workspace to view {resourceLabel}. Open a workspace from the
          list or pick one in the header switcher.
        </Text>
        <Link to={ROUTES.WORKSPACES} className="mt-2">
          <Button variant="primary">Go to workspaces</Button>
        </Link>
      </div>
    </Card>
  );
}
