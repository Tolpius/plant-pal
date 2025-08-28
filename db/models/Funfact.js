import mongoose from "mongoose";

const { Schema } = mongoose;
const funfactSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

const Funfact =
  mongoose.models.Funfact || mongoose.model("Funfact", funfactSchema);

export default Funfact;
