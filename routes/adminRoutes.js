const express = require("express");
const router = express.Router();
const { getUsers, toggleLockUser, deleteUser } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Toàn bộ route trong file này chỉ dành cho Admin
router.use(protect, authorize("admin"));

router.get("/users", getUsers);
router.patch("/users/:id/lock", toggleLockUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
