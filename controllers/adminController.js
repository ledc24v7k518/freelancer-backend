const User = require("../models/User");

// @route   GET /api/admin/users
// @desc    Xem danh sách tài khoản (Freelancer, Doanh nghiệp)
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = { role: { $ne: "admin" } }; // không hiển thị tài khoản admin khác
    if (role) filter.role = role;

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   PATCH /api/admin/users/:id/lock
// @desc    Khóa / mở khóa tài khoản
// @access  Private (Admin)
exports.toggleLockUser = async (req, res) => { // Chỉ Admin mới có quyền khóa/mở khóa tài khoản
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Không thể khóa tài khoản admin" });
    }

    user.isLocked = !user.isLocked;
    await user.save();

    res.status(200).json({
      message: user.isLocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
      user: { id: user._id, name: user.name, email: user.email, isLocked: user.isLocked },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   DELETE /api/admin/users/:id
// @desc    Xóa tài khoản
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Không thể xóa tài khoản admin" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "Đã xóa tài khoản" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
