import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  studentId: string;
  assignmentId: mongoose.Types.ObjectId;
  submittedAt: Date;
  status: "submitted" | "pending";
  fileUrl?: string;
}

const submissionSchema = new Schema<ISubmission>({
  studentId: { type: String, required: true },
  assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["submitted", "pending"], default: "pending" },
  fileUrl: String,
});

const SubmissionModel: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", submissionSchema);

export default SubmissionModel;
