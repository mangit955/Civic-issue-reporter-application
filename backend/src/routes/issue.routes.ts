import { Router, Request, Response, NextFunction } from "express";
import { upload } from "../middlerware/upload.middleware";
import { createIssue, getIssues } from "../controllers/issues.controllers";
import { userMiddleware } from "../middlerware/auth.middleware";

const router = Router();
router.post(
  "/user/issue/create",
  userMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Before upload middleware");
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

router.get("/user/all-issues", userMiddleware, getIssues);

export default router;
