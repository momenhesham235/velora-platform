import mongoose, { Document, Schema } from 'mongoose';

export interface INotification {
  userId: string;
  workspaceId?: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface INotificationDocument extends INotification, Document {}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true, index: true },
    workspaceId: { type: String, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, required: true, default: 'info' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>(
  'Notification',
  notificationSchema
);
