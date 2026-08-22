const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập họ tên"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      trim: true, // loại bỏ khoảng trắng đầu/cuối
      match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["freelancer", "employer", "admin"],
      default: "freelancer",
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // tự động thêm createdAt, updatedAt
);

module.exports = mongoose.model("User", userSchema);
