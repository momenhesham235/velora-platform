import { Project, IProjectDocument } from './project.model';
import { CreateProjectDTO, UpdateProjectDTO } from './project.types';
import { ApiError } from '@core/ApiError';
import { AuditService } from '@modules/audit/audit.service';
import { AuditAction } from '@modules/audit/audit.model';
import { PaginatedResponse } from '@velora/types';

export class ProjectService {
  static async create(
    workspaceId: string,
    userId: string,
    data: CreateProjectDTO
  ): Promise<IProjectDocument> {
    const project = await Project.create({
      workspaceId,
      name: data.name,
      description: data.description,
      createdBy: userId,
    });

    await AuditService.log({
      workspaceId,
      actorId: userId,
      action: AuditAction.PROJECT_CREATED,
      resourceType: 'project',
      resourceId: project._id.toString(),
      metadata: { name: project.name },
    });

    return project;
  }

  static async list(
    workspaceId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<IProjectDocument>> {
    const skip = (page - 1) * limit;
    const filter = { workspaceId };

    const [items, total] = await Promise.all([
      Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  static async getById(
    workspaceId: string,
    projectId: string
  ): Promise<IProjectDocument> {
    const project = await Project.findOne({ _id: projectId, workspaceId });
    if (!project) throw ApiError.notFound('Project not found');
    return project;
  }

  static async update(
    workspaceId: string,
    projectId: string,
    userId: string,
    data: UpdateProjectDTO
  ): Promise<IProjectDocument> {
    const project = await this.getById(workspaceId, projectId);

    if (data.name !== undefined) project.name = data.name;
    if (data.description !== undefined) project.description = data.description;

    await project.save();

    await AuditService.log({
      workspaceId,
      actorId: userId,
      action: AuditAction.PROJECT_UPDATED,
      resourceType: 'project',
      resourceId: projectId,
    });

    return project;
  }

  static async delete(
    workspaceId: string,
    projectId: string,
    userId: string
  ): Promise<void> {
    const project = await this.getById(workspaceId, projectId);
    await Project.findByIdAndDelete(project._id);

    await AuditService.log({
      workspaceId,
      actorId: userId,
      action: AuditAction.PROJECT_DELETED,
      resourceType: 'project',
      resourceId: projectId,
    });
  }
}
