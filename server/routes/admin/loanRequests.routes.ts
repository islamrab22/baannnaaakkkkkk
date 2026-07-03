import { Router } from "express";
import { loanRequestController } from "../../controllers/loanRequest.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { updateLoanRequestSchema, loanRequestQuerySchema } from "../../validators/loanRequest.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: loanRequestQuerySchema }), loanRequestController.list);
router.get("/:id", validate({ params: idParamSchema }), loanRequestController.getById);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateLoanRequestSchema }), loanRequestController.update);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), loanRequestController.remove);

export default router;
