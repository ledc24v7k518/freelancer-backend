const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

// Đăng ký tất cả model với Mongoose ngay khi khởi động
// (cần thiết để .populate() có thể resolve các model được tham chiếu qua ref: "TênModel")
require("./models/User");
require("./models/Profile");
require("./models/Category");
require("./models/Project");
require("./models/Application");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profiles", require("./routes/profileRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("API hệ thống kết nối Freelancer với Nhà tuyển dụng đang chạy");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});
