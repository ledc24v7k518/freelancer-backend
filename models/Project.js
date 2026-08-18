const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
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
  { timestamps: true } // tự động thêm createdAt
);

module.exports = mongoose.model("Project", projectSchema);
