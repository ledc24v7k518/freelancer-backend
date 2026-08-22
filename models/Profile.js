const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // tham chiếu đến User
      ref: "User",
      required: true,
      unique: true, // quan hệ 1-1 với users
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: [
        {
          title: { type: String, required: true },
          company: { type: String },
          startDate: { type: Date },
          endDate: { type: Date },
          description: { type: String },
        },
      ],
      default: [],
    },
    portfolioUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
