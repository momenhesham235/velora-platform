import mongoose, { Document, Schema } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface ITask {
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskDocument extends ITask, Document {}

const taskSchema = new Schema<ITaskDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 500 },
    description: { type: String, maxlength: 5000 },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    assigneeId: { type: String, index: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

taskSchema.index({ workspaceId: 1, projectId: 1 });

export const Task = mongoose.model<ITaskDocument>('Task', taskSchema);
