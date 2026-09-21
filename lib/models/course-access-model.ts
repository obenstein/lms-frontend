import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourseAccess extends Document {
  studentId: string;
  courseId: string;
  grantedAt: Date;
  title: string;
}

const courseAccessSchema = new Schema<ICourseAccess>({
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  grantedAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
});

courseAccessSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const CourseAccessModel: Model<ICourseAccess> =
  mongoose.models.CourseAccess ||
  mongoose.model<ICourseAccess>("CourseAccess", courseAccessSchema);

export default CourseAccessModel;
