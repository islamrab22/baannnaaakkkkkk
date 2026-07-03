import { Router } from "express";
import { messageController } from "../../controllers/message.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { updateMessageSchema, messageQuerySchema } from "../../validators/message.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: messageQuerySchema }), messageController.list);
router.get("/:id", validate({ params: idParamSchema }), messageController.getById);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateMessageSchema }), messageController.updateStatus);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), messageController.remove);

export default router;
