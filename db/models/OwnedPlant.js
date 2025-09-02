import mongoose from "mongoose";

const { Schema } = mongoose;
const ownedPlantSchema = new Schema(
  {
    cataloguePlantId: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    botanicalName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    waterNeed: { type: String, required: true },
    lightNeed: { type: String, required: true },
    fertiliserSeasons: { type: [String], required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const OwnedPlant =
  mongoose.models.OwnedPlant || mongoose.model("OwnedPlant", ownedPlantSchema);

export default OwnedPlant;
