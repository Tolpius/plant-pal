import mongoose from "mongoose";

const { Schema } = mongoose;
const plantSchema = new Schema({
  name: { type: String, required: false },
  botanicalName: { type: String, required: false },
  imageUrl: { type: String, required: false },
  waterNeed: { type: String, required: false },
  lightNeed: { type: String, required: false },
  fertiliserSeason: { type: [String], required: false },
  description: { type: String, required: false },
});

const Plant = mongoose.models.Plant || mongoose.model("Plant", plantSchema);

export default Plant;
