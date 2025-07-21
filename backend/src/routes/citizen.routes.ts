import { Router } from "express";
import {
  citizenSignin,
  citizenSignup,
} from "../controllers/auth-controllers/citizen.auth.controller";
import { authMiddleware } from "../middlerware/auth.middleware";
import {
  deleteIssue,
  getCitizenProfile,
  getIssuesBycitizen,
  updateCitizenProfile,
} from "../controllers/citizen.controller";

const router = Router();

router.post("/signup/citizen", citizenSignup);

router.post("/signin/citizen", citizenSignin);

router.get("/citizen/:id", authMiddleware, getCitizenProfile);

router.put("/citizen/:id", authMiddleware, updateCitizenProfile);

router.get("/citizen/issue", authMiddleware, getIssuesBycitizen);

router.delete("/citizen/issue", authMiddleware, deleteIssue);

export default router;
