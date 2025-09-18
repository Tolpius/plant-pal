import mongoose from "mongoose";
import OwnedPlant from "./OwnedPlant";

const { Schema } = mongoose;

const reminderSchema = new Schema(
  {
    plantId: { type: Schema.Types.ObjectId, ref: OwnedPlant, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    time: { type: String, required: false },
  },
  { timestamps: true }
);

// Indexe für schnellere Abfragen
reminderSchema.index({ userId: 1 });
reminderSchema.index({ dueDate: 1 });

const Reminder =
  mongoose.models.Reminder || mongoose.model("Reminder", reminderSchema);

export default Reminder;
