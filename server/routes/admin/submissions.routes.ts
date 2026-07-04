import { Router } from "express";
import { submissionController } from "../../controllers/submission.controller.ts";
import { requireAuth } from "../../middleware/auth.middleware.ts";

const router = Router();

router.use(requireAuth);
router.get("/", submissionController.list);

export default router;
