import mongoose from "mongoose";
import Plant from "./Plant";

const { Schema } = mongoose;
const ownedPlantSchema = new Schema(
  {
    cataloguePlant: {
      type: Schema.Types.ObjectId,
      ref: Plant,
      required: true,
    },
    userId: { type: String, required: true },
    nickname: { type: String },
    location: { type: String },
    userImageUrl: { type: String },
    acquiredDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// Index for finding all owned Plants of a user
// /api/user/[userId]/owned/[plantId]/index.js
ownedPlantSchema.index({ userId: 1 });

// Index for finding out, how many of this plant a user has
// /api/plants/[id]/countowned/index.js
ownedPlantSchema.index({ userId: 1, cataloguePlant: 1 });

const OwnedPlant =
  mongoose.models.OwnedPlant || mongoose.model("OwnedPlant", ownedPlantSchema);

export default OwnedPlant;
