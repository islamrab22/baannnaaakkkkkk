import { Router } from "express";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { productService } from "../services/product.service.ts";
import { productController } from "../controllers/product.controller.ts";
import { campaignController } from "../controllers/campaign.controller.ts";
import { branchController } from "../controllers/branch.controller.ts";
import { newsController } from "../controllers/news.controller.ts";
import { messageController } from "../controllers/message.controller.ts";
import { loanRequestController } from "../controllers/loanRequest.controller.ts";
import { cardRequestController } from "../controllers/cardRequest.controller.ts";
import { miscController } from "../controllers/misc.controller.ts";
import { submissionController } from "../controllers/submission.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { writeRateLimiter } from "../middleware/rateLimit.middleware.ts";
import { createContactMessageSchema, createNewsletterSchema, createCareerMessageSchema, createVisitorEventSchema } from "../validators/message.validators.ts";
import { createLoanRequestSchema } from "../validators/loanRequest.validators.ts";
import { createCardRequestSchema } from "../validators/cardRequest.validators.ts";

const router = Router();

function publicProductGroup(group: string) {
  return asyncHandler(async (req: Request, res: Response) => {
    const segment = (req.query.category as string) === "business" ? "BUSINESS" : "PERSONAL";
    res.json(await productService.listPublic(group, segment));
  });
}

// Products by category
router.get("/accounts", publicProductGroup("ACCOUNT"));
router.get("/accounts/:slug", productController.publicGetBySlug);
router.get("/loans", publicProductGroup("LOAN"));
router.get("/loans/:slug", productController.publicGetBySlug);
router.get("/cards", publicProductGroup("CARD"));
router.get("/cards/:slug", productController.publicGetBySlug);
router.get("/electronic-services", publicProductGroup("ELECTRONIC_SERVICE"));
router.get("/electronic-services/:slug", productController.publicGetBySlug);
router.get("/transfers", miscController.transfers);

router.get("/campaigns", campaignController.publicList);
router.get("/branches", branchController.publicList);
router.get("/branches/:id", branchController.getById);
router.get("/exchange-rates", miscController.exchangeRates);
router.get("/news", newsController.publicList);
router.get("/news/:slug", newsController.publicGetBySlug);
router.get("/about", miscController.about);
router.get("/locale/:lang", miscController.locale);
router.get("/search", miscController.search);
router.post("/compare", miscController.compare);

// Lead capture / public write endpoints
router.post("/contact", writeRateLimiter, validate({ body: createContactMessageSchema }), messageController.submitContact);
router.post("/newsletter/subscribe", writeRateLimiter, validate({ body: createNewsletterSchema }), messageController.submitNewsletter);
router.post("/loan-inquiry", writeRateLimiter, validate({ body: createLoanRequestSchema }), loanRequestController.submit);
router.post("/card-inquiry", writeRateLimiter, validate({ body: createCardRequestSchema }), cardRequestController.submit);
router.post("/careers/apply", writeRateLimiter, validate({ body: createCareerMessageSchema }), messageController.submitCareer);
router.post("/visitor-event", writeRateLimiter, validate({ body: createVisitorEventSchema }), messageController.submitVisitorEvent);
router.post("/submissions", writeRateLimiter, submissionController.create);

export default router;
