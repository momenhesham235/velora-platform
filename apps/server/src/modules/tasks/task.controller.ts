import { Request, Response } from 'express';
import { asyncHandler } from '@middlewares/asyncHandler';
import { ResponseUtil } from '@core/response';
import { TaskService } from './task.service';
import { CreateTaskDTO, UpdateTaskDTO } from './task.types';

export class TaskController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const data: CreateTaskDTO = req.body;
    const task = await TaskService.create(workspaceId, req.user!.id, data);
    return ResponseUtil.created(res, 'Task created successfully', task);
  });

  static list = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const projectId = req.query.projectId as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await TaskService.list(workspaceId, projectId, page, limit);
    return ResponseUtil.success(
      res,
      'Tasks retrieved successfully',
      result.items,
      200,
      result.meta
    );
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId, id } = req.params;
    const task = await TaskService.getById(workspaceId, id);
    return ResponseUtil.success(res, 'Task retrieved successfully', task);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId, id } = req.params;
    const data: UpdateTaskDTO = req.body;
    const task = await TaskService.update(
      workspaceId,
      id,
      req.user!.id,
      data
    );
    return ResponseUtil.success(res, 'Task updated successfully', task);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId, id } = req.params;
    await TaskService.delete(workspaceId, id, req.user!.id);
    return ResponseUtil.success(res, 'Task deleted successfully');
  });
}
