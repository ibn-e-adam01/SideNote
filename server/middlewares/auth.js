const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token; // Read your token cookie

    if (!token) {
      return res.status(401).json({ message: "Access denied. Please log in first." });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user payload to the request
    
    next(); // Pass control to the next function (your profile route)
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = requireAuth;