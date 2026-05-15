import mongoose, { Document, Schema } from 'mongoose';

export enum AuditAction {
  WORKSPACE_CREATED = 'workspace.created',
  WORKSPACE_UPDATED = 'workspace.updated',
  WORKSPACE_DELETED = 'workspace.deleted',
  MEMBER_ADDED = 'member.added',
  MEMBER_REMOVED = 'member.removed',
  MEMBER_ROLE_UPDATED = 'member.role_updated',
  PROJECT_CREATED = 'project.created',
  PROJECT_UPDATED = 'project.updated',
  PROJECT_DELETED = 'project.deleted',
  TASK_CREATED = 'task.created',
  TASK_UPDATED = 'task.updated',
  TASK_DELETED = 'task.deleted',
}

export interface IAuditLog {
  workspaceId: string;
  actorId: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface IAuditLogDocument extends IAuditLog, Document {}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    actorId: { type: String, required: true, index: true },
    action: { type: String, required: true, enum: Object.values(AuditAction) },
    resourceType: { type: String, required: true },
    resourceId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ workspaceId: 1, createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLogDocument>(
  'AuditLog',
  auditLogSchema
);
