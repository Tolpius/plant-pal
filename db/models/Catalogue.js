import mongoose from "mongoose";

const { Schema } = mongoose;
const catalogueSchema = new Schema({
  name: { type: String, required: true },
  botanicalName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  waterNeed: { type: String, required: true },
  lightNeed: { type: String, required: true },
  fertiliserSeasons: { type: [String], required: true },
  description: { type: String, required: true },
});

const Catalogue = mongoose.models.Catalogue || mongoose.model("Catalogue", catalogueSchema);

export default Catalogue;
