import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  const secret = process.env.JWT_SECRET || "secret";

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });
  next();
};

export default authMiddleware;
export { adminMiddleware };