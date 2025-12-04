// src/utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  // Agar sirf id aayi ho (user login), to { id } bana do
  const data =
    typeof payload === "object"
      ? payload                // e.g. { id: 8, role: "admin" }
      : { id: payload };       // e.g. 8 → { id: 8 }

  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
