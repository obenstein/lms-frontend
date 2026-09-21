import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILiveSession extends Document {
  title: string;
  description?: string;
  startTime: Date;
  invitees: string[];
  joinLink: string;
}

const liveSessionSchema = new Schema<ILiveSession>({
  title: { type: String, required: true },
  description: String,
  startTime: { type: Date, required: true },
  invitees: [{ type: String }],
  joinLink: { type: String, required: true },
});

const LiveSessionModel: Model<ILiveSession> =
  mongoose.models.LiveSession ||
  mongoose.model<ILiveSession>("LiveSession", liveSessionSchema);

export default LiveSessionModel;
