import { Router } from 'express';
import {
  authenticate,
  requireEmailVerification,
  validate,
} from '@middlewares/index';
import { requirePermission } from '@core/rbac';
import { Permission } from '@velora/types';
import { TaskController } from './task.controller';
import { taskValidation } from './task.validation';

const router: Router = Router({ mergeParams: true });

router.use(authenticate, requireEmailVerification);

router.post(
  '/',
  validate(taskValidation.create),
  requirePermission(Permission.TASK_CREATE),
  TaskController.create
);

router.get(
  '/',
  validate(taskValidation.list),
  requirePermission(Permission.TASK_VIEW),
  TaskController.list
);

router.get(
  '/:id',
  validate(taskValidation.getById),
  requirePermission(Permission.TASK_VIEW),
  TaskController.getById
);

router.patch(
  '/:id',
  validate(taskValidation.update),
  requirePermission(Permission.TASK_UPDATE),
  TaskController.update
);

router.delete(
  '/:id',
  validate(taskValidation.delete),
  requirePermission(Permission.TASK_DELETE),
  TaskController.delete
);

export default router;
