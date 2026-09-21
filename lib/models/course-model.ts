import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  userId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  attachments: string[];
  purchased: Map<string, boolean>;
  price: number;
  isPublished: boolean;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    userId: { type: String, required: true },
    // NB: original schema had `reqiured: true` (typo) which Mongoose silently
    // ignores, so `title` was NEVER actually enforced as required in prod.
    // Preserving that exact (buggy) behavior here for parity. Flip to
    // `required: true` once you've confirmed no existing docs rely on this.
    title: { type: String },
    description: String,
    imageUrl: String,
    attachments: { type: [{ type: String }], default: [] },
    purchased: { type: Map, of: Boolean, default: {} },
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    categoryId: String,
  },
  { timestamps: true }
);

const CourseModel: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default CourseModel;
