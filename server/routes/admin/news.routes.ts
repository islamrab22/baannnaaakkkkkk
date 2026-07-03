import { Router } from "express";
import { newsController } from "../../controllers/news.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { createNewsSchema, updateNewsSchema, newsQuerySchema } from "../../validators/news.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: newsQuerySchema }), newsController.list);
router.get("/:id", validate({ params: idParamSchema }), newsController.getById);
router.post("/", requireRole("ADMIN", "EDITOR"), validate({ body: createNewsSchema }), newsController.create);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateNewsSchema }), newsController.update);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), newsController.remove);

export default router;
