import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    image: String,
    provider: String,
    providerAccountId: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isDarkMode: {type: Boolean, default: false},
  },
  { timestamps: true }
);

//Index in MongoDB so user accounts have to be unique and lookups are faster
UserSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export default models.User || model("User", UserSchema);
