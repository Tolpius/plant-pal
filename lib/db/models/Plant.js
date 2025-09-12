import mongoose from "mongoose";

const { Schema } = mongoose;
const plantSchema = new Schema({
  name: { type: String, required: true },
  botanicalName: { type: String, required: true },
  imageUrl: { type: String, required: false },
  imageStoragePath: { type: String, required: false },
  waterNeed: { type: String, required: true },
  lightNeed: { type: String, required: true },
  fertiliserSeasons: { type: [String], required: true },
  description: { type: String, required: true },
  isPublic:{type: Boolean, default: false}
});

const Plant = mongoose.models.Plant || mongoose.model("Plant", plantSchema);

export default Plant;
