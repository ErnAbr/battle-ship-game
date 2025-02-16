const jwt = require("jsonwebtoken");
const User = require("../user.model");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
