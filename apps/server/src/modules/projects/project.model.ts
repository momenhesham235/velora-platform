import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  workspaceId: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends IProject, Document {}

const projectSchema = new Schema<IProjectDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

projectSchema.index({ workspaceId: 1, name: 1 });

export const Project = mongoose.model<IProjectDocument>('Project', projectSchema);
