import { Router } from "express";
import {
  adminSignin,
  adminSignup,
} from "../controllers/auth-controllers/admin.auth.controller";
import { authMiddleware } from "../middlerware/auth.middleware";
import {
  deleteAdmin,
  getAdminProfile,
  updateAdminProfile,
  updateIssueStatus,
} from "../controllers/admin.controller";
import { getIssues } from "../controllers/issues.controllers";

const router = Router();

router.post("/signup/admin", adminSignup);

router.post("/signin/admin", adminSignin);

router.get("/admin/:id", authMiddleware, getAdminProfile);

router.get("/admin/issues", authMiddleware, getIssues);

router.put("/admin/:id", authMiddleware, updateAdminProfile);

router.put("/admin/issue/status", authMiddleware, updateIssueStatus);

router.delete("/issue/admin/delete", authMiddleware, deleteAdmin);

export default router;
