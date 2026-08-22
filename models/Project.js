const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId, // tham chiếu đến User (employer)
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId, // tham chiếu đến Category
      ref: "Category",
      required: [true, "Vui lòng chọn danh mục cho dự án"],
    },
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề dự án"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả dự án"],
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
