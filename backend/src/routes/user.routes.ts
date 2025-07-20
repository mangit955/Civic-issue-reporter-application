import { Router } from "express";
import {
  userSignin,
  userSignup,
} from "../controllers/auth-controllers/user.auth.controller";
import { userMiddleware } from "../middlerware/auth.middleware";
import {
  deleteIssue,
  getCitizenProfile,
  getIssuesByUser,
  updateCitizenProfile,
} from "../controllers/user.controller";
import { getIssues } from "../controllers/issues.controllers";

const router = Router();

router.post("/signup/user", userSignup);

router.post("/signin/user", userSignin);

router.get("/citizen/:id", userMiddleware, getCitizenProfile);

router.get("/citizen/:id", userMiddleware, updateCitizenProfile);

router.get("/user/issue", userMiddleware, getIssuesByUser);

router.delete("/user/issue", userMiddleware, deleteIssue);

export default router;
