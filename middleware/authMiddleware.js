const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Kiểm tra và xác thực JWT token gửi kèm trong header Authorization
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token, từ chối truy cập" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    if (user.isLocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    req.user = user; // Gắn thông tin user vào req để các middleware và route handler tiếp theo có thể sử dụng
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware kiểm tra quyền truy cập dựa trên role của user
// roles là một mảng các role được phép truy cập, ví dụ: ["admin", "employer"]
// Nếu user.role không nằm trong roles, trả về lỗi 403
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
    }
    next();
  };
};
