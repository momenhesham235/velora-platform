import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireEmailVerification, validate, asyncHandler } from '@middlewares/index';
import { requirePermission } from '@core/rbac';
import { Permission } from '@velora/types';
import { ResponseUtil } from '@core/response';
import { AuditService } from './audit.service';

const router: Router = Router({ mergeParams: true });

router.use(authenticate, requireEmailVerification);

const listValidation = z.object({
  params: z.object({
    workspaceId: z.string().min(1),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});

router.get(
  '/',
  validate(listValidation),
  requirePermission(Permission.WORKSPACE_VIEW),
  asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await AuditService.getWorkspaceActivity(
      workspaceId,
      page,
      limit
    );

    return ResponseUtil.success(
      res,
      'Activity retrieved successfully',
      result.items,
      200,
      result.meta
    );
  })
);

export default router;
