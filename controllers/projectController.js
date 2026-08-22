const Project = require("../models/Project");

// @route   GET /api/projects
// @desc    Tìm kiếm / lọc dự án theo danh mục
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { categoryId, status } = req.query;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    filter.status = status || "open"; // mặc định chỉ hiện dự án đang mở

    const projects = await Project.find(filter)
      .populate("employerId", "name email")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   GET /api/projects/:id
// @desc    Xem chi tiết một dự án
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("employerId", "name email")
      .populate("categoryId", "name");

    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   POST /api/projects
// @desc    Đăng dự án mới
// @access  Private (Employer)
exports.createProject = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin dự án" });
    }

    const project = await Project.create({
      title,
      description,
      categoryId,
      employerId: req.user._id,
    });

    res.status(201).json({ message: "Đăng dự án thành công", project });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   PUT /api/projects/:id
// @desc    Sửa thông tin dự án
// @access  Private (Employer - chủ dự án)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }

    // Chỉ chủ dự án mới có quyền sửa dự án
    if (project.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền sửa dự án này" });
    }

    const { title, description, categoryId } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (categoryId !== undefined) project.categoryId = categoryId;

    await project.save();

    res.status(200).json({ message: "Cập nhật dự án thành công", project });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   PATCH /api/projects/:id/close
// @desc    Đóng dự án (ngừng nhận ứng tuyển)
// @access  Private (Employer - chủ dự án)
exports.closeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }

    if (project.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền đóng dự án này" });
    }

    project.status = "closed";
    await project.save();

    res.status(200).json({ message: "Đã đóng dự án", project });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
