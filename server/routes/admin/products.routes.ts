import { Router } from "express";
import { productController } from "../../controllers/product.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { createProductSchema, updateProductSchema, productQuerySchema } from "../../validators/product.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: productQuerySchema }), productController.list);
router.get("/:id", validate({ params: idParamSchema }), productController.getById);
router.post("/", requireRole("ADMIN", "EDITOR"), validate({ body: createProductSchema }), productController.create);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateProductSchema }), productController.update);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), productController.remove);

export default router;
