import { Router } from "express";
import { categoryController } from "../../controllers/category.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { createCategorySchema, updateCategorySchema, categoryQuerySchema } from "../../validators/category.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: categoryQuerySchema }), categoryController.list);
router.get("/all", categoryController.listAll);
router.get("/:id", validate({ params: idParamSchema }), categoryController.getById);
router.post("/", requireRole("ADMIN", "EDITOR"), validate({ body: createCategorySchema }), categoryController.create);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateCategorySchema }), categoryController.update);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), categoryController.remove);

export default router;
