import { Request, Response } from 'express';
import { asyncHandler } from '@middlewares/asyncHandler';
import { ResponseUtil } from '@core/response';
import { ProjectService } from './project.service';
import { CreateProjectDTO, UpdateProjectDTO } from './project.types';

export class ProjectController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const data: CreateProjectDTO = req.body;
    const project = await ProjectService.create(
      workspaceId,
      req.user!.id,
      data
    );
    return ResponseUtil.created(res, 'Project created successfully', project);
  });

  static list = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await ProjectService.list(workspaceId, page, limit);
    return ResponseUtil.success(
      res,
      'Projects retrieved successfully',
      result.items,
      200,
      result.meta
    );
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId, id } = req.params;
    const project = await ProjectService.getById(workspaceId, id);
    return ResponseUtil.success(res, 'Project retrieved successfully', project);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId, id } = req.params;
    const data: UpdateProjectDTO = req.body;
    const project = await ProjectService.update(
      workspaceId,
      id,
      req.user!.id,
      data
    );
    return ResponseUtil.success(res, 'Project updated successfully', project);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId, id } = req.params;
    await ProjectService.delete(workspaceId, id, req.user!.id);
    return ResponseUtil.success(res, 'Project deleted successfully');
  });
}
