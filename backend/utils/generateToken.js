import jwt from "jsonwebtoken";

const generateToken = (user) => {
  // ← CRITICAL: Create token with consistent field names
  const payload = {
    id: user._id.toString(),        // ← Use 'id' consistently
    email: user.email,
    role: user.role,
    name: user.name,
  };

  console.log("🔐 Generating token with payload:", { id: payload.id, email: payload.email, role: payload.role });

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("✅ Token generated successfully");
  return token;
};

export default generateToken;