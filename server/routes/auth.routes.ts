import { Router } from "express";
import { authController } from "../controllers/auth.controller.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { authRateLimiter } from "../middleware/rateLimit.middleware.ts";
import { loginSchema, changePasswordSchema, updateProfileSchema } from "../validators/auth.validators.ts";

const router = Router();

router.post("/login", authRateLimiter, validate({ body: loginSchema }), authController.login);
router.post("/refresh", authRateLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);
router.patch("/me", requireAuth, validate({ body: updateProfileSchema }), authController.updateProfile);
router.post("/change-password", requireAuth, validate({ body: changePasswordSchema }), authController.changePassword);

export default router;
