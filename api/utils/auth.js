const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token comes in the Authorization header as 'Bearer TOKEN'

  if (!token) {
    return res.status(403).json({ message: "Token is missing!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

module.exports = verifyToken;
