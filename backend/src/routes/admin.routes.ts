import { Router } from "express";
import {
  adminSignin,
  adminSignup,
} from "../controllers/auth-controllers/admin.auth.controller";
import { userMiddleware } from "../middlerware/auth.middleware";
import { deleteAdmin, getAdmin } from "../controllers/admin.controller";

const router = Router();

router.post("/signup/admin", adminSignup);

router.post("/signin/admin", adminSignin);

router.get("/admin/issues", userMiddleware, getAdmin);

router.delete("/issue/admin/delete", userMiddleware, deleteAdmin);

export default router;
