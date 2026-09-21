import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAssignment extends Document {
  courseId?: mongoose.Types.ObjectId;
  chapterId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  createdBy: string;
  fileUrl?: string;
}

const assignmentSchema = new Schema<IAssignment>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: false },
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  createdBy: { type: String, required: true },
  fileUrl: String,
});

const AssignmentModel: Model<IAssignment> =
  mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", assignmentSchema);

export default AssignmentModel;
