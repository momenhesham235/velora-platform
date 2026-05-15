import { Notification, INotificationDocument } from './notification.model';
import { PaginatedResponse } from '@velora/types';
import { ApiError } from '@core/ApiError';

export interface CreateNotificationInput {
  userId: string;
  workspaceId?: string;
  title: string;
  message: string;
  type?: string;
  metadata?: Record<string, unknown>;
}

export class NotificationService {
  static async create(
    input: CreateNotificationInput
  ): Promise<INotificationDocument> {
    return Notification.create({
      userId: input.userId,
      workspaceId: input.workspaceId,
      title: input.title,
      message: input.message,
      type: input.type || 'info',
      metadata: input.metadata,
      read: false,
    });
  }

  static async listForUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedResponse<INotificationDocument>> {
    const filter: Record<string, unknown> = { userId };
    if (unreadOnly) filter.read = false;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  static async markAsRead(
    userId: string,
    notificationId: string
  ): Promise<INotificationDocument> {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });
    if (!notification) throw ApiError.notFound('Notification not found');

    notification.read = true;
    await notification.save();
    return notification;
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ userId, read: false }, { read: true });
  }
}
