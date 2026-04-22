import mongoose from "mongoose";

const GoalLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

// Ensure a user can only have one log per goal per day
GoalLogSchema.index({ userId: 1, goalId: 1, date: 1 }, { unique: true });

export default mongoose.models.GoalLog || mongoose.model("GoalLog", GoalLogSchema);
