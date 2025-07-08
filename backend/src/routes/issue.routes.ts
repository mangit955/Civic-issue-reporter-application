import { Router } from "express";
import { upload } from "../middlerware/upload.middleware";
import { createIssue } from "../controllers/issues.controllers";
import { userMiddleware } from "../middlerware/auth.middleware";

const router = Router();

router.post(
  "/create/issue/user",
  userMiddleware,
  upload.array("files", 10),
  createIssue
);

export default router;
