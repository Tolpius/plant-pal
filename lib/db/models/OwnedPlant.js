import mongoose from "mongoose";

const { Schema } = mongoose;
const ownedPlantSchema = new Schema(
  {
    cataloguePlantId: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    botanicalName: { type: String, required: true },
    imageUrl: { type: String, required: false },
    imageStoragePath: { type: String, required: false },
    waterNeed: { type: String, required: true },
    lightNeed: { type: String, required: true },
    fertiliserSeasons: { type: [String], required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// Index for finding all owned Plants of a user
// /api/user/[userId]/owned/[plantId]/index.js
ownedPlantSchema.index({ userId: 1 });

// Index for finding out, how many of this plant a user has
// /api/plants/[id]/countowned/index.js
ownedPlantSchema.index({ userId: 1, cataloguePlantId: 1 });

const OwnedPlant =
  mongoose.models.OwnedPlant || mongoose.model("OwnedPlant", ownedPlantSchema);

export default OwnedPlant;
