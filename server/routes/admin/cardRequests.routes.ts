import { Router } from "express";
import { cardRequestController } from "../../controllers/cardRequest.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { updateCardRequestSchema, cardRequestQuerySchema } from "../../validators/cardRequest.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: cardRequestQuerySchema }), cardRequestController.list);
router.get("/:id", validate({ params: idParamSchema }), cardRequestController.getById);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateCardRequestSchema }), cardRequestController.update);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), cardRequestController.remove);

export default router;
