import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    num_phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      default: "member",
    },
  },
  { timestamps: true, versionKey: false }
);
// userSchema.methods = {
//   createPasswordChangedToken: () => {
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     this.passwordResetToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
//     this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
//     return resetToken;
//   },
// };
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
});
export default mongoose.model("User", userSchema);
