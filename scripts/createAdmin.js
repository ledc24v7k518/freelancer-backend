// Chạy cmd: node scripts/createAdmin.js
// Dùng để tạo tài khoản admin đầu tiên (không thể tạo qua API /api/auth/register)
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ADMIN_NAME = "Quản trị viên";
const ADMIN_EMAIL = "ltle@freelancer.com";
const ADMIN_PASSWORD = "admin123";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("Tài khoản admin đã tồn tại:", ADMIN_EMAIL);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Tạo tài khoản admin thành công!");
  console.log("Email:", ADMIN_EMAIL);
  console.log("Mật khẩu:", ADMIN_PASSWORD);
  process.exit(0);
};

run().catch((err) => {
  console.error("Lỗi:", err.message);
  process.exit(1);
});
