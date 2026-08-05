const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({"Chào mừng đến với hệ thống kết nối Freelancer với Nhà tuyển dụng "})
});

module.exports = app;