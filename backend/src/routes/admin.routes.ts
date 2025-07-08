import { Router, Request } from "express";
import {
  adminSignin,
  adminSignup,
} from "../controllers/auth-controllers/admin.auth.controller";
import { IssueModel } from "../models/issue.model";
import { userMiddleware } from "../middlerware/auth.middleware";

const router = Router();
interface AuthRequest extends Request {
  userId?: string;
}

router.post("/signup/admin", adminSignup);

router.post("/signin/admin", adminSignin);

router.get("/issue/admin", async (req, res) => {
  try {
    const issue = await IssueModel.find({}).populate("userId", "username");
    res.json({
      issue,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.delete("/issue/admin/delete", userMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    userId: authReq.userId,
  });

  if (result.deletedCount === 0) {
    res.status(404).json({
      message: "Issue not found",
    });
  } else {
    res.json({
      message: " Deleted Sucessfully!",
    });
  }
});

export default router;
