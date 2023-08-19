import User from "../model/user";
import { signupSchema, signinSchema } from "../schemas/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sendMail from "../ultils/sendMail";

dotenv.config();
export const getsUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(404).json({ message: "Không có người dùng nào" });
    }
    return res.status(200).json({
      message: "Danh sách người dùng",
      user,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không có người dùng nào" });
    }
    return res.status(200).json({
      message: "Lấy người dùng thành công",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(400).json({ message: "update không thành công" });
    }
    return res.status(200).json({
      message: "Update thành công",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
export const removeUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không có người dùng nào" });
    }
    return res.status(200).json({
      message: "Xóa người dùng thành công",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const signup = async (req, res) => {
  try {
    //validate dau vao
    const { error } = signupSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    //kiem tra email da ton tai hay chua
    const ExistEmail = await User.findOne({ email: req.body.email });
    if (ExistEmail) {
      return res.status(400).json({
        message: "Email da ton tai",
      });
    }
    //Ma hoa mat khau
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    //tao user moi voi mat khau da ma hoa
    const user = await User.create({
      ...req.body,
      password: hashPassword,
    });
    //tra ve client voi mat khau rong de bao mat mat khau
    user.password = undefined;
    return res.status(201).json({
      message: "Tao tai khoan thanh cong",
      data: user,
    });
  } catch (error) {}
};
// B1: Kiểm tra thông tin req.body có hợp lệ hay không
// B2: Kiểm tra email đã tồn tại hay chưa?
// B2.1: Mã hóa mật khẩu trước khi tạo user mới
// B3: Tạo user mới
// B4: Tạo token mới chứa id của user
// B5: Trả về client

export const signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        messages: errors,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        messages: "Email không tồn tại",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        messages: "Sai mật khẩu",
      });
    }
    const token = jwt.sign({ id: user._id }, "diendeptrai", {
      expiresIn: "1d",
    });
    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken: token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "ncc",
    });
  }
};
// Đăng nhập
// B1: Kiểm tra thông tin req.body có hợp lệ hay không
// B2: Kiểm tra email đã tồn tại hay chưa?
// B2.1: So sánh password client với password trong db
// B3: Tạo token mới chứa id của user
// B4: Trả về client

//Quên pass
// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Vui lòng nhập email",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Tài khoản không tồn tại",
    });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=http://localhost:8080/api/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const mail = await sendMail(data);
  return res.status(200).json({
    message: "Ok",
    mail,
  });
};
export const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) {
    return res.status(400).json({
      message: "Vui lòng nhập pass or token",
    });
  }
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      message: "token không tồn tại hoặc đã hết hạn",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  user.password = hashPassword;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    message: " Updated password",
  });
};
