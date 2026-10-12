import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", { id: decoded.id, email: decoded.email, role: decoded.role });
    
    // ← IMPORTANT: Set req.user with id, email, role
    req.user = {
      id: decoded.id || decoded._id, // Some systems use _id, some use id
      email: decoded.email,
      role: decoded.role,
      ...decoded // Keep all other fields too
    };
    
    console.log("✅ req.user set:", req.user);
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

export default authMiddleware;