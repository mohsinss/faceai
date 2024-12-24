import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const feasibilitySchema = mongoose.Schema(
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

feasibilitySchema.plugin(toJSON);

export default mongoose.models.Feasibility || mongoose.model("Feasibility", feasibilitySchema);