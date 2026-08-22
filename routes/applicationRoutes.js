// api/applications/*
const express = require("express");
const router = express.Router();
const {
  applyToProject,
  getMyApplications,
  acceptApplication,
  rejectApplication,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("freelancer"), applyToProject); // Freelancer nộp đơn ứng tuyển cho dự án
router.get("/me", protect, authorize("freelancer"), getMyApplications); // Freelancer xem lịch sử ứng tuyển của chính mình
router.patch("/:id/accept", protect, authorize("employer"), acceptApplication);
router.patch("/:id/reject", protect, authorize("employer"), rejectApplication);

module.exports = router;
