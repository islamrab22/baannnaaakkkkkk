import { Router } from "express";
import { dashboardController } from "../../controllers/dashboard.controller.ts";
import { requireAuth } from "../../middleware/auth.middleware.ts";

const router = Router();

router.use(requireAuth);
router.get("/stats", dashboardController.stats);

export default router;
