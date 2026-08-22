const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: "appliedAt", updatedAt: true } } // Tự động thêm appliedAt và updatedAt
);

// Một Freelancer chỉ được ứng tuyển 1 lần vào cùng 1 dự án
applicationSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
