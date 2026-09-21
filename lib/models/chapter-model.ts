import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChapterAssignment {
  _id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  points?: number;
  fileUrl?: string;
}

export interface IChapter extends Document {
  courseId: string;
  userId: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  assetId?: string;
  playbackId?: string;
  position?: number;
  isCompleted: Map<string, boolean>;
  isPublished: boolean;
  isFree: boolean;
  purchased: Map<string, boolean>;
  userProgress: Map<string, boolean>;
  attachments: string[];
  assignments: IChapterAssignment[];
  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
  {
    courseId: { type: String, required: true },
    userId: { type: String, required: true },
    title: String,
    description: String,
    videoUrl: String,
    assetId: String,
    playbackId: String,
    position: Number,
    isCompleted: { type: Map, of: Boolean, default: {} },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
    purchased: { type: Map, of: Boolean, default: {} },
    userProgress: { type: Map, of: Boolean, default: {} },
    attachments: { type: [{ type: String }], default: [] },
    assignments: [
      {
        title: String,
        description: String,
        dueDate: String,
        points: Number,
        fileUrl: String,
      },
    ],
  },
  { timestamps: true }
);

const ChapterModel: Model<IChapter> =
  mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", chapterSchema);

export default ChapterModel;
