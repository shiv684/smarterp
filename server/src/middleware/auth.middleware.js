require("dotenv").config({ path: require('path').resolve(__dirname, '../../.env') });
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Token:", token);
  console.log("Secret:", process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({ message: "Login karo pehle" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(401).json({ message: "Token is invalid " });
  }
};

module.exports = protect;