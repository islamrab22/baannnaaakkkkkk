import { Router } from "express";
import { campaignController } from "../../controllers/campaign.controller.ts";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { idParamSchema } from "../../validators/common.validators.ts";
import { createCampaignSchema, updateCampaignSchema, campaignQuerySchema } from "../../validators/campaign.validators.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: campaignQuerySchema }), campaignController.list);
router.get("/:id", validate({ params: idParamSchema }), campaignController.getById);
router.post("/", requireRole("ADMIN", "EDITOR"), validate({ body: createCampaignSchema }), campaignController.create);
router.patch("/:id", requireRole("ADMIN", "EDITOR"), validate({ params: idParamSchema, body: updateCampaignSchema }), campaignController.update);
router.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), campaignController.remove);

export default router;
