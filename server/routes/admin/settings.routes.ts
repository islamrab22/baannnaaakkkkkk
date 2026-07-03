import { Router } from "express";
import { settingsController } from "../../controllers/settings.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { updateSettingsSchema } from "../../validators/settings.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", settingsController.get);
router.patch("/", requireRole("ADMIN"), validate({ body: updateSettingsSchema }), settingsController.update);

export default router;
