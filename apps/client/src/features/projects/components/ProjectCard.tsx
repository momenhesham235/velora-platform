import { Link } from 'react-router-dom';
import { Card, Chip, Heading, Text } from '@/shared/components/ui';
import { workspaceRoute } from '@/shared/constants';
import type { Project } from '@velora/types';

interface ProjectCardProps {
  workspaceId: string;
  project: Project;
}

export function ProjectCard({ workspaceId, project }: ProjectCardProps) {
  const tasksUrl = `${workspaceRoute.tasks(workspaceId)}?projectId=${project.id}`;

  return (
    <Card padding="lg" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Heading as="h3" size="h3" className="truncate">
          {project.name}
        </Heading>
        <Chip tone="neutral" size="sm">
          Project
        </Chip>
      </div>
      {project.description ? (
        <Text tone="secondary" className="line-clamp-2 text-sm">
          {project.description}
        </Text>
      ) : (
        <Text tone="secondary" className="text-sm">
          No description
        </Text>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        <Link
          to={tasksUrl}
          className="text-sm font-medium text-primary hover:underline"
        >
          View tasks
        </Link>
        <Text tone="secondary" className="text-xs">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </Text>
      </div>
    </Card>
  );
}
