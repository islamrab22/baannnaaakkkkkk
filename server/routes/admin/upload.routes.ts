import { Router } from "express";
import { uploadController } from "../../controllers/upload.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { uploadImage } from "../../middleware/upload.middleware.ts";

const router = Router();

router.post("/image", requireAuth, requireRole("ADMIN", "EDITOR"), uploadImage, uploadController.uploadImage);

export default router;
