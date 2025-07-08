import { Router, Request } from "express";
import {
  userSignin,
  userSignup,
} from "../controllers/auth-controllers/user.auth.controller";
import { IssueModel } from "../models/issue.model";
import { userMiddleware } from "../middlerware/auth.middleware";

const router = Router();
interface AuthRequest extends Request {
  userId?: string;
}

router.post("/signup/user", userSignup);
router.post("/signin/user", userSignin);
router.get("/issue/user", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const issue = await IssueModel.find({
    userId: userId,
  }).populate("userId", "username");

  res.json({
    issue,
  });
});
router.delete("/issue/user", userMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    userId: authReq.userId,
  });

  if (result.deletedCount === 0) {
    res.status(404).json({
      message: " Content not found !",
    });
  } else {
    res.json({
      message: "Deleted Successfully !",
    });
  }
});
export default router;
