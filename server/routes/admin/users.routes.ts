import { Router } from "express";
import { userController } from "../../controllers/user.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { createUserSchema, updateUserSchema } from "../../validators/user.validators.ts";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/", userController.list);
router.get("/:id", validate({ params: idParamSchema }), userController.getById);
router.post("/", validate({ body: createUserSchema }), userController.create);
router.patch("/:id", validate({ params: idParamSchema, body: updateUserSchema }), userController.update);
router.delete("/:id", validate({ params: idParamSchema }), userController.remove);

export default router;
