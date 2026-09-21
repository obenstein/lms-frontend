import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkItem extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: "note" | "reminder" | "todo";
  createdAt: Date;
  dueAt?: Date;
  completed: boolean;
}

const workItemSchema = new Schema<IWorkItem>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["note", "reminder", "todo"], default: "todo" },
  createdAt: { type: Date, default: Date.now },
  dueAt: Date,
  completed: { type: Boolean, default: false },
});

const WorkItemModel: Model<IWorkItem> =
  mongoose.models.WorkItem || mongoose.model<IWorkItem>("WorkItem", workItemSchema);

export default WorkItemModel;
