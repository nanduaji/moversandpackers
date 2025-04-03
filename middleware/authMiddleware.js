const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: No token provided or incorrect format" 
      });
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    next(); 
  } catch (err) {
    console.error("JWT Verification Error:", err);

    let errorMessage = "Forbidden: Invalid token";
    if (err.name === "TokenExpiredError") {
      errorMessage = "Forbidden: Token has expired";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Forbidden: Malformed token";
    }

    return res.status(403).json({ 
      success: false, 
      message: errorMessage, 
      error: err.message 
    });
  }
};

module.exports = authMiddleware;
