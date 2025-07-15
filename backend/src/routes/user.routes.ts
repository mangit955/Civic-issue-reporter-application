import { Router } from "express";
import {
  userSignin,
  userSignup,
} from "../controllers/auth-controllers/user.auth.controller";
import { userMiddleware } from "../middlerware/auth.middleware";
import { deleteIssue, getIssuesByUser } from "../controllers/user.controller";

const router = Router();

router.post("/signup/user", userSignup);
router.post("/signin/user", userSignin);
router.get("/user/issue", userMiddleware, getIssuesByUser);
router.delete("/user/issue", userMiddleware, deleteIssue);
export default router;
