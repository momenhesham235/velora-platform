import { Router } from 'express';
import {
  authenticate,
  requireEmailVerification,
  validate,
} from '@middlewares/index';
import { requirePermission } from '@core/rbac';
import { Permission } from '@velora/types';
import { ProjectController } from './project.controller';
import { projectValidation } from './project.validation';

const router: Router = Router({ mergeParams: true });

router.use(authenticate, requireEmailVerification);

router.post(
  '/',
  validate(projectValidation.create),
  requirePermission(Permission.PROJECT_CREATE),
  ProjectController.create
);

router.get(
  '/',
  validate(projectValidation.list),
  requirePermission(Permission.PROJECT_VIEW),
  ProjectController.list
);

router.get(
  '/:id',
  validate(projectValidation.getById),
  requirePermission(Permission.PROJECT_VIEW),
  ProjectController.getById
);

router.patch(
  '/:id',
  validate(projectValidation.update),
  requirePermission(Permission.PROJECT_UPDATE),
  ProjectController.update
);

router.delete(
  '/:id',
  validate(projectValidation.delete),
  requirePermission(Permission.PROJECT_DELETE),
  ProjectController.delete
);

export default router;
