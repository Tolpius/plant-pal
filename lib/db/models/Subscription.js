import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: { type: String, required: true },
    endpoint: { type: String, required: true, unique: true },
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1 });

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
