import { Button, Card, Chip, Text } from '@/shared/components/ui';
import { TaskStatus } from '@velora/types';
import type { Project, Task } from '@velora/types';

const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To do',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.DONE]: 'Done',
};

const STATUS_TONE: Record<
  TaskStatus,
  'neutral' | 'warning' | 'success'
> = {
  [TaskStatus.TODO]: 'neutral',
  [TaskStatus.IN_PROGRESS]: 'warning',
  [TaskStatus.DONE]: 'success',
};

interface TaskCardProps {
  task: Task;
  project?: Project;
  onStatusChange: (taskId: string, status: TaskStatus, projectId: string) => void;
  onDelete: (taskId: string) => void;
  isUpdating?: boolean;
}

export function TaskCard({
  task,
  project,
  onStatusChange,
  onDelete,
  isUpdating,
}: TaskCardProps) {
  const cycleStatus = () => {
    const order = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    const idx = order.indexOf(task.status);
    const next = order[(idx + 1) % order.length];
    onStatusChange(task.id, next, task.projectId);
  };

  return (
    <Card padding="md" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <Text className="font-medium text-foreground">{task.title}</Text>
        {task.description ? (
          <Text tone="secondary" className="mt-1 line-clamp-2 text-sm">
            {task.description}
          </Text>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chip tone={STATUS_TONE[task.status]} size="sm">
            {STATUS_LABEL[task.status]}
          </Chip>
          {project ? (
            <Text tone="secondary" className="text-xs">
              {project.name}
            </Text>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="secondary"
          size="sm"
          onPress={cycleStatus}
          isDisabled={isUpdating}
        >
          Advance
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-danger"
          onPress={() => onDelete(task.id)}
          isDisabled={isUpdating}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
