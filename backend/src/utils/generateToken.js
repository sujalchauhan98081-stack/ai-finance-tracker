import jwt from "jsonwebtoken";

// Creates a signed JWT containing the user's ID
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token auto-expires in 30 days
  });
};

export default generateToken;