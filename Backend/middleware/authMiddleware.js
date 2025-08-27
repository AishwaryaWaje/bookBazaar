import jwt from "jsonwebtoken";

/**
 * @description Middleware to protect routes by verifying JWT token from cookies or Authorization header.
 * Attaches user information to `req.user` if the token is valid.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Calls `next()` if authenticated, otherwise sends a 401 response.
 */
export const protect = (req, res, next) => {
  let token = null;

  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId || decoded.id || decoded._id,
      username: decoded.username,
      isAdmin: decoded.isAdmin || false,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Authentication token expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid authentication token." });
    } else {
      return res.status(401).json({ message: "Not authorized, token failed." });
    }
  }
};

/**
 * @description Middleware to restrict access to admin users only.
 * Requires `protect` middleware to be run first to populate `req.user`.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Calls `next()` if the user is an admin, otherwise sends a 401 response.
 */
export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(401).json({ message: "Access denied. Admins only." });
  }
  next();
};
