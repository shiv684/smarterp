const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Get token from request header
  // Header looks like: Authorization: "Bearer eyJhbGci..."
  const token = req.headers.authorization?.split(" ")[1];

  // If no token found, send error
  if (!token) {
    return res.status(401).json({ message: "Login karo pehle" });
  }

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user id in request object for next function
    req.user = decoded;

    // Move to next function
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid hai" });
  }
};

module.exports = protect;