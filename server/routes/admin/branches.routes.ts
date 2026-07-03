import { Router } from "express";
import { branchController } from "../../controllers/branch.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema, paginationQuerySchema } from "../../validators/common.validators.ts";
import { createBranchSchema, updateBranchSchema } from "../../validators/branch.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: paginationQuerySchema }), branchController.list);
router.get("/:id", validate({ params: idParamSchema }), branchController.getById);
router.post("/", requireRole("ADMIN", "EDITOR"), validate({ body: createBranchSchema }), branchController.create);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateBranchSchema }), branchController.update);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), branchController.remove);

export default router;
