import { Router } from "express";
import {
	meController,
	signInController,
	signOutController,
} from "./auth.controller";
import { validate } from "@/middlewares/validate";
import { signInSchema, signUpSchema } from "./auth.dto";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/signin", validate(signInSchema), signInController);
router.post("/signout", validate(signUpSchema), signOutController);
router.get("/me", authenticate, meController);

export default router;
