import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const analyticsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    generatedEmail: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

analyticsSchema.plugin(toJSON);

export default mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema); 