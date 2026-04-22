import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    target: { type: Number, required: true },
    targetType: { type: String, enum: ["boolean", "number"], default: "boolean" },
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
