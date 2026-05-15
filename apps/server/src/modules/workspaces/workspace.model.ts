import mongoose, { Schema, Document, Model } from 'mongoose';
import { WorkspaceRole } from '@velora/types';

/**
 * Workspace Model
 * 
 * Mongoose schema and model for workspace management
 */

// Internal types for Mongoose
interface IWorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
}

interface IWorkspace {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: IWorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkspaceDocument extends Omit<IWorkspace, '_id'>, Document {}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    role: {
      type: String,
      enum: Object.values(WorkspaceRole),
      default: WorkspaceRole.MEMBER,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const workspaceSchema = new Schema<IWorkspaceDocument>(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      minlength: [2, 'Workspace name must be at least 2 characters'],
      maxlength: [100, 'Workspace name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    ownerId: {
      type: String,
      required: [true, 'Owner ID is required'],
      ref: 'User',
    },
    members: {
      type: [workspaceMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown> & { _id?: unknown }) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
workspaceSchema.index({ ownerId: 1 });
workspaceSchema.index({ 'members.userId': 1 });
workspaceSchema.index({ name: 1, ownerId: 1 });

// Ensure owner is always in members array with owner role
workspaceSchema.pre('save', function (next) {
  const workspace = this as IWorkspaceDocument;
  
  // Check if owner is in members
  const ownerMember = workspace.members.find(
    (member) => member.userId === workspace.ownerId
  );

  if (!ownerMember) {
    // Add owner to members
    workspace.members.unshift({
      userId: workspace.ownerId,
      role: WorkspaceRole.OWNER,
      joinedAt: new Date(),
    });
  } else if (ownerMember.role !== WorkspaceRole.OWNER) {
    // Ensure owner has owner role
    ownerMember.role = WorkspaceRole.OWNER;
  }

  next();
});

export const Workspace: Model<IWorkspaceDocument> =
  mongoose.model<IWorkspaceDocument>('Workspace', workspaceSchema);
