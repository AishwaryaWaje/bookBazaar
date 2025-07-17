import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authentication denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId || decoded.id,
      isAdmin: decoded.isAdmin || false,
    };
    next();
  } catch {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};
export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(401).json({ message: "Access denied. Admins only." });
  }
  next();
};
