import jwt from "jsonwebtoken";
import User from "../model/user";
import dotenv from "dotenv";
dotenv.config();
export const checkPermission = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!authHeader) {
    return res.status(401).json({
      message: "Ban chua dang nhap",
    });
  }
  jwt.verify(token, "diendeptrai", async (err, payload) => {
    // console.log(payload);
    if (err && err.name === "JsonWebTokenError") {
      return res.status(400).json({
        message: "Token không hợp lệ",
      });
    }
    if (err && err.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Token đã hết hạn",
      });
    }
    const user = await User.findById(payload.id);
    // console.log(user);
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Ban khong du quyen de thuc hien hanh dong nay",
      });
    }
    next();
  });
};
// Kiểm tra req.headers.authorization có tồn tại hay không?
// Kiểm tra token có hợp lệ hay không?
// Dựa vào token để lấy payload, so sánh với id của user trong db
// Kiểm tra xem quyền của user có đủ để thực hiện hành động hay không?
// Nếu có thì next(), không thì trả về lỗi
