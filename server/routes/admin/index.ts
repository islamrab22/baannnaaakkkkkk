import { Router } from "express";
import usersRoutes from "./users.routes.ts";
import productsRoutes from "./products.routes.ts";
import categoriesRoutes from "./categories.routes.ts";
import campaignsRoutes from "./campaigns.routes.ts";
import newsRoutes from "./news.routes.ts";
import branchesRoutes from "./branches.routes.ts";
import messagesRoutes from "./messages.routes.ts";
import loanRequestsRoutes from "./loanRequests.routes.ts";
import cardRequestsRoutes from "./cardRequests.routes.ts";
import settingsRoutes from "./settings.routes.ts";
import dashboardRoutes from "./dashboard.routes.ts";
import uploadRoutes from "./upload.routes.ts";
import submissionsRoutes from "./submissions.routes.ts";

const router = Router();

router.use("/users", usersRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/campaigns", campaignsRoutes);
router.use("/news", newsRoutes);
router.use("/branches", branchesRoutes);
router.use("/messages", messagesRoutes);
router.use("/loan-requests", loanRequestsRoutes);
router.use("/card-requests", cardRequestsRoutes);
router.use("/settings", settingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);
router.use("/submissions", submissionsRoutes);

export default router;
