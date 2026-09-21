import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStripeCustomer extends Document {
  userId?: string;
  stripeCustomerId?: string;
  email?: string;
}

// NB: original schema passed `{ timestapes: true }` (typo) as the options
// object, so timestamps were never actually enabled. Preserved as-is
// (no timestamps) for parity — fix deliberately if you want createdAt/updatedAt.
const stripeCustomerSchema = new Schema<IStripeCustomer>({
  userId: String,
  stripeCustomerId: String,
  email: String,
});

const StripeCustomerModel: Model<IStripeCustomer> =
  mongoose.models["stripe-customer"] ||
  mongoose.model<IStripeCustomer>("stripe-customer", stripeCustomerSchema);

export default StripeCustomerModel;
