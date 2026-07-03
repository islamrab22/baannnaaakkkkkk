import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import adminRoutes from "./admin/index.ts";
import publicRoutes from "./public.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/", publicRoutes);

export default router;
