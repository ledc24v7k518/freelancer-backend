// api/projects/*
const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  closeProject,
} = require("../controllers/projectController");
const { getApplicationsByProject } = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public - ai cũng xem được
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Private - chỉ Doanh nghiệp (employer) đã đăng nhập
router.post("/", protect, authorize("employer"), createProject);
router.put("/:id", protect, authorize("employer"), updateProject);
router.patch("/:id/close", protect, authorize("employer"), closeProject);
router.get("/:id/applications", protect, authorize("employer"), getApplicationsByProject);

module.exports = router;
