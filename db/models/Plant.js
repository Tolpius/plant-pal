import mongoose from "mongoose";

const { Schema } = mongoose;
const plantSchema = new Schema({
  name: { type: String, required: true },
  botanicalName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  waterNeed: { type: String, required: true },
  lightNeed: { type: String, required: true },
  fertiliserSeason: { type: [String], required: true },
  description: { type: String, required: true },
});

const Plant = mongoose.models.Plant || mongoose.model("Plant", plantSchema);

export default Plant;
