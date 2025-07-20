import { Router } from "express";
import {
  adminSignin,
  adminSignup,
} from "../controllers/auth-controllers/admin.auth.controller";
import { userMiddleware } from "../middlerware/auth.middleware";
import { deleteAdmin } from "../controllers/admin.controller";
import { getIssues } from "../controllers/issues.controllers";

const router = Router();

router.post("/signup/admin", adminSignup);

router.post("/signin/admin", adminSignin);

router.get("/admin/issues", userMiddleware, getIssues);

router.delete("/issue/admin/delete", userMiddleware, deleteAdmin);

export default router;
