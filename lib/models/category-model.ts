import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
});

const CategoryModel: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default CategoryModel;
