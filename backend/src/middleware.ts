import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (
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
  console.log("Extracted token:", token);

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };

    console.log("Decoded JWT:", decoded);
    //@ts-ignore
    req.userId = decoded.id;
    next();
  } catch (e) {
    console.log("Error verifying JWT:", e);
    res.status(403).json({
      message: "Invalid token or expired",
    });
  }
};
