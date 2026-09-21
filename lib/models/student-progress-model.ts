import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudentProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  chapterId: mongoose.Types.ObjectId;
  completed: boolean;
  lastWatchedAt: Date;
}

const studentProgressSchema = new Schema<IStudentProgress>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
  completed: { type: Boolean, default: false },
  lastWatchedAt: { type: Date, default: Date.now },
});

const StudentProgressModel: Model<IStudentProgress> =
  mongoose.models.StudentProgress ||
  mongoose.model<IStudentProgress>("StudentProgress", studentProgressSchema);

export default StudentProgressModel;
