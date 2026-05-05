import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is missing");
  }
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    },
  );
};
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message:
          "No authorization header provided. Send: Authorization: Bearer <token>",
      });
    }

    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // Support sending just the token without "Bearer " prefix
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodedToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token: " + error.message });
    }
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default authMiddleware;

export const isAdmin = (req, res, next) => {
  if (req.userData.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized : Not a Admin" });
  }
  next();
};

export const isManager = (req, res, next) => {
  if (req.userData.role !== "manager") {
    return res.status(403).json({ message: "Unauthorized : Not a Manager" });
  }
  next();
};

export const isManagerOrAdmin = (req, res, next) => {
  if (req.userData.role !== "manager" && req.userData.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Unauthorized : Not a Manager or Admin" });
  }
  next();
};

export const isEmployee = (req, res, next) => {
  if (req.userData.role !== "employee") {
    return res.status(403).json({ message: "Unauthorized : Not a Employee" });
  }
  next();
};
