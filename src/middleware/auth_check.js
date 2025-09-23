const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
  const token = req.header("auth-token");
  if (token == undefined || token == null)
    return res.status(400).json({
      success: false,
      message: "Authentication failed Token Not Found",
    });
  try {
    const verified = jwt.verify(token, process.env.token_private);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication Error! Please provide a valid token",
    });
  }
};

const isAdmin = (req, res, next) => {
  const token = req.header("auth-token");
  if (token == undefined || token == null)
    return res.status(400).json({
      success: false,
      message: "Authentication failed Token Not Found",
    });

  try {
    const verified = jwt.verify(token, process.env.token_private);
    console.log("user role: ",verified.role);
    if (verified.role == "admin") {
      req.user = verified;
      next();
    } else
      return res.status(400).json({
        success: false,
        message: "Only Admin has access to this task",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication Error! Please provide a valid token",
    });
  }
};

module.exports = {
  authVerify,
  isAdmin,
};
