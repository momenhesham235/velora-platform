import { Task, ITaskDocument, TaskStatus } from './task.model';
import { CreateTaskDTO, UpdateTaskDTO } from './task.types';
import { Project } from '@modules/projects/project.model';
import { ApiError } from '@core/ApiError';
import { AuditService } from '@modules/audit/audit.service';
import { AuditAction } from '@modules/audit/audit.model';
import { PaginatedResponse } from '@velora/types';

export class TaskService {
  private static async assertProjectInWorkspace(
    workspaceId: string,
    projectId: string
  ): Promise<void> {
    const project = await Project.findOne({ _id: projectId, workspaceId });
    if (!project) {
      throw ApiError.notFound('Project not found in this workspace');
    }
  }

  static async create(
    workspaceId: string,
    userId: string,
    data: CreateTaskDTO
  ): Promise<ITaskDocument> {
    await this.assertProjectInWorkspace(workspaceId, data.projectId);

    const task = await Task.create({
      workspaceId,
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      assigneeId: data.assigneeId,
      status: data.status || TaskStatus.TODO,
      createdBy: userId,
    });

    await AuditService.log({
      workspaceId,
      actorId: userId,
      action: AuditAction.TASK_CREATED,
      resourceType: 'task',
      resourceId: task._id.toString(),
      metadata: { title: task.title, projectId: data.projectId },
    });

    return task;
  }

  static async list(
    workspaceId: string,
    projectId: string | undefined,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<ITaskDocument>> {
    const filter: Record<string, string> = { workspaceId };
    if (projectId) filter.projectId = projectId;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Task.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  static async getById(
    workspaceId: string,
    taskId: string
  ): Promise<ITaskDocument> {
    const task = await Task.findOne({ _id: taskId, workspaceId });
    if (!task) throw ApiError.notFound('Task not found');
    return task;
  }

  static async update(
    workspaceId: string,
    taskId: string,
    userId: string,
    data: UpdateTaskDTO
  ): Promise<ITaskDocument> {
    const task = await this.getById(workspaceId, taskId);

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status;
    if (data.assigneeId !== undefined) task.assigneeId = data.assigneeId;

    await task.save();

    await AuditService.log({
      workspaceId,
      actorId: userId,
      action: AuditAction.TASK_UPDATED,
      resourceType: 'task',
      resourceId: taskId,
    });

    return task;
  }

  static async delete(
    workspaceId: string,
    taskId: string,
    userId: string
  ): Promise<void> {
    await this.getById(workspaceId, taskId);
    await Task.findOneAndDelete({ _id: taskId, workspaceId });

    await AuditService.log({
      workspaceId,
      actorId: userId,
      action: AuditAction.TASK_DELETED,
      resourceType: 'task',
      resourceId: taskId,
    });
  }
}
