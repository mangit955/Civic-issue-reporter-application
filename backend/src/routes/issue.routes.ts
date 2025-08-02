import { Router, Request, Response, NextFunction } from "express";
import { upload } from "../middlerware/upload.middleware";
import { createIssue, getIssues } from "../controllers/issues.controllers";
import { authMiddleware } from "../middlerware/auth.middleware";

const router = Router();
router.post(
  "/citizen/create-issue",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    upload.array("files", 10)(req, res, (err) => {
      console.log("Upload middleware callback");
      if (err) {
        console.error("=== UPLOAD ERROR ===");
        console.error("Error type:", typeof err);
        console.error("Error:", err);
        console.error("Error message:", err?.message);
        return res
          .status(400)
          .json({ message: "Upload failed", error: err.message });
      }
      console.log("Upload successful, proceeding to controller");
      next();
    });
  },
  createIssue
);

router.get("/all-issues", authMiddleware, getIssues);

export default router;
