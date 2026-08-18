const express = require("express");
const router = express.Router();
const { getMyProfile, updateMyProfile } = require("../controllers/profileController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Chỉ Freelancer đã đăng nhập mới truy cập được các route này
router.use(protect, authorize("freelancer"));

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

module.exports = router;
