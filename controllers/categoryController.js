const Category = require("../models/Category");

// @route   GET /api/categories
// @desc    Lấy danh sách danh mục
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sắp xếp theo tên danh mục tăng dần
    res.status(200).json({ count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   POST /api/categories
// @desc    Tạo danh mục mới
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Vui lòng nhập tên danh mục" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Danh mục này đã tồn tại" });
    }

    const category = await Category.create({ name, description });
    res.status(201).json({ message: "Tạo danh mục thành công", category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   PUT /api/categories/:id
// @desc    Cập nhật danh mục
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    await category.save();

    res.status(200).json({ message: "Cập nhật danh mục thành công", category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   DELETE /api/categories/:id
// @desc    Xóa danh mục
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(200).json({ message: "Đã xóa danh mục" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
