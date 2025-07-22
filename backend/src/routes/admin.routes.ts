import { Router } from "express";
import {
  adminSignin,
  adminSignup,
} from "../controllers/auth-controllers/admin.auth.controller";
import { authMiddleware } from "../middlerware/auth.middleware";
import {
  deleteIssueByAdmin,
  getAdminProfile,
  updateAdminProfile,
  updateIssueStatus,
} from "../controllers/admin.controller";
import { getIssues } from "../controllers/issues.controllers";

const router = Router();

router.post("/admin/signup", adminSignup);

router.post("/admin/signin", adminSignin);

router.get("/admin/profile/:id", authMiddleware, getAdminProfile);

router.get("/admin/issues", authMiddleware, getIssues);

router.put("/admin/:id", authMiddleware, updateAdminProfile);

router.put("/admin/issue/:id/status", authMiddleware, updateIssueStatus);

router.delete("/issue/admin/:id", authMiddleware, deleteIssueByAdmin);

export default router;
