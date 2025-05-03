const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalid or expired" });
  }
};

const restrictTo = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ message: `Access denied: ${role} only` });
  next();
};

module.exports = { verifyToken, restrictTo };
