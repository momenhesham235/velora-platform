import { Router } from 'express';
import { z } from 'zod';
import {
  authenticate,
  requireEmailVerification,
  validate,
  asyncHandler,
} from '@middlewares/index';
import { ResponseUtil } from '@core/response';
import { NotificationService } from './notification.service';

const router: Router = Router();

router.use(authenticate, requireEmailVerification);

const listValidation = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    unreadOnly: z
      .enum(['true', 'false'])
      .optional()
      .transform((v) => v === 'true'),
  }),
});

router.get(
  '/',
  validate(listValidation),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    const result = await NotificationService.listForUser(
      userId,
      page,
      limit,
      unreadOnly
    );

    return ResponseUtil.success(
      res,
      'Notifications retrieved successfully',
      result.items,
      200,
      result.meta
    );
  })
);

router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const notification = await NotificationService.markAsRead(
      req.user!.id,
      req.params.id
    );
    return ResponseUtil.success(
      res,
      'Notification marked as read',
      notification
    );
  })
);

router.post(
  '/read-all',
  asyncHandler(async (req, res) => {
    await NotificationService.markAllAsRead(req.user!.id);
    return ResponseUtil.success(res, 'All notifications marked as read');
  })
);

export default router;
