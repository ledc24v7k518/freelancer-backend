const Application = require("../models/Application");
const Project = require("../models/Project");

// @route   POST /api/applications
// @desc    Freelancer ứng tuyển vào dự án
// @access  Private (Freelancer)
exports.applyToProject = async (req, res) => { // Chỉ Freelancer mới có quyền ứng tuyển
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Vui lòng cung cấp projectId" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }
    if (project.status !== "open") {
      return res.status(400).json({ message: "Dự án này đã đóng, không thể ứng tuyển" });
    }

    if (project.employerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Bạn không thể ứng tuyển vào dự án của chính mình" });
    }

    const application = await Application.create({
      projectId,
      freelancerId: req.user._id,
      status: "pending",
    });

    res.status(201).json({ message: "Ứng tuyển thành công", application });
  } catch (error) {
    // Nếu lỗi là do trùng lặp (Freelancer đã ứng tuyển vào dự án này), trả về lỗi 409
    if (error.code === 11000) {
      return res.status(409).json({ message: "Bạn đã ứng tuyển vào dự án này rồi" });
    }
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   GET /api/projects/:id/applications
// @desc    Doanh nghiệp xem danh sách Freelancer đã ứng tuyển vào dự án của mình
// @access  Private (employer)
exports.getApplicationsByProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }
    if (project.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền xem danh sách ứng viên của dự án này" });
    }

    const applications = await Application.find({ projectId: req.params.id })
      .populate("freelancerId", "name email")
      .sort({ appliedAt: -1 });

    res.status(200).json({ count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   GET /api/applications/me
// @desc    Freelancer xem lịch sử ứng tuyển của chính mình
// @access  Private (Freelancer)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ freelancerId: req.user._id })
      .populate({
        path: "projectId",
        select: "title status employerId",
        populate: { path: "employerId", select: "name" },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({ count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Hàm dùng chung để xử lý chấp nhận hoặc từ chối ứng tuyển
const updateApplicationStatus = async (req, res, newStatus) => {
  try {
    const application = await Application.findById(req.params.id).populate("projectId");
    if (!application) {
      return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển" });
    }

    // Chỉ chủ dự án mới có quyền chấp nhận hoặc từ chối ứng tuyển
    if (application.projectId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền xử lý đơn ứng tuyển này" });
    }

    application.status = newStatus;
    await application.save();

    res.status(200).json({
      message: newStatus === "accepted" ? "Đã chấp nhận ứng viên" : "Đã từ chối ứng viên",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   PATCH /api/applications/:id/accept
// @access  Private (Employer - chủ dự án)
exports.acceptApplication = (req, res) => updateApplicationStatus(req, res, "accepted");

// @route   PATCH /api/applications/:id/reject
// @access  Private (Employer - chủ dự án)
exports.rejectApplication = (req, res) => updateApplicationStatus(req, res, "rejected");
