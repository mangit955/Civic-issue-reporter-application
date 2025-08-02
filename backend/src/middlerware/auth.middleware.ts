import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: "admin" | "citizen";
}

declare global {
  namespace Express {
    interface Request {
      citizenId?: string;
      adminId?: string;
      role?: "admin" | "citizen";
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];

  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("Invalid token or missing authorization header");
    res.status(401).json({
      message: "Authorization header is missing or malformed",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  // JWT_PASSWORD is expected to be set in the environment variables
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PASSWORD!
    ) as DecodedToken;

    console.log("Decoded JWT:", decoded);
    //@ts-ignore
    if (decoded.role === "citizen") {
      req.citizenId = decoded.id;
    } else if (decoded.role === "admin") {
      req.adminId = decoded.id;
    }
    req.role = decoded.role;
    next();
  } catch (e) {
    console.error("Error verifying JWT:", e);
    res.status(403).json({
      message: "Invalid token or expired",
    });
  }
};
