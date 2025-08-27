import mongoose from "mongoose";

/**
 * @typedef {object} User
 * @property {string} username - The user's chosen username. Min 3, max 30 characters.
 * @property {string} email - The user's unique email address.
 * @property {string} password - The user's hashed password. Min 6 characters.
 * @property {boolean} [isAdmin=false] - Indicates if the user has administrative privileges.
 * @property {string} [otp] - One-Time Password for account recovery or verification.
 * @property {Date} [otpExpires] - Expiration timestamp for the OTP.
 * @property {number} [passwordResetAttempts=0] - Number of failed password reset attempts.
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  isAdmin: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  passwordResetAttempts: { type: Number, default: 0 },
});

/**
 * Mongoose model for User.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model("User", userSchema);
export default User;
