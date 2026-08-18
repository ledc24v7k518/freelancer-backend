const Profile = require("../models/Profile");

// @route   GET /api/profiles/me
// @desc    Xem hồ sơ cá nhân của Freelancer đang đăng nhập
// @access  Private (Freelancer)
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    // Nếu Freelancer chưa từng tạo hồ sơ, tự động tạo hồ sơ rỗng
    if (!profile) {
      profile = await Profile.create({ userId: req.user._id });
    }

    res.status(200).json({
      profile: {
        id: profile._id,
        name: req.user.name,
        email: req.user.email,
        bio: profile.bio,
        skills: profile.skills,
        experience: profile.experience,
        portfolioUrl: profile.portfolioUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// @route   PUT /api/profiles/me
// @desc    Cập nhật hồ sơ cá nhân (bio, kỹ năng, kinh nghiệm, portfolio)
// @access  Private (Freelancer)
exports.updateMyProfile = async (req, res) => {
  try {
    const { bio, skills, experience, portfolioUrl } = req.body;

    // Validate cơ bản: skills và experience phải đúng kiểu mảng nếu được gửi lên
    if (skills !== undefined && !Array.isArray(skills)) {
      return res.status(400).json({ message: "skills phải là một mảng chuỗi" });
    }
    if (experience !== undefined && !Array.isArray(experience)) {
      return res.status(400).json({ message: "experience phải là một mảng" });
    }

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (experience !== undefined) updateData.experience = experience;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công",
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
