import { AuditLog, AuditAction } from './audit.model';
import { PaginatedResponse } from '@velora/types';

export interface CreateAuditLogInput {
  workspaceId: string;
  actorId: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  static async log(input: CreateAuditLogInput): Promise<void> {
    await AuditLog.create(input);
  }

  static async getWorkspaceActivity(
    workspaceId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<typeof AuditLog.prototype>> {
    const skip = (page - 1) * limit;
    const filter = { workspaceId };

    const [items, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
