import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * @description Generates a JWT for admin authentication.
 * @param {object} user - The user object containing id, username, and isAdmin status.
 * @returns {string} The generated JWT.
 */
const generateAdminToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * @description Handles admin login, authenticates credentials, and sets a JWT cookie.
 * @route POST /api/admin/login
 * @param {object} req - The request object.
 * @param {string} req.body.email - The admin user's email.
 * @param {string} req.body.password - The admin user's password.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with a success message, JWT, and admin user details.
 * @throws {object} - A JSON object with an error message if login fails.
 */
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "Access denied. Not an admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAdminToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin logged in successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: true,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @description Handles admin logout by clearing the JWT cookie.
 * @route POST /api/admin/logout
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with a success message.
 */
export const adminLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Admin logged out successfully" });
};
