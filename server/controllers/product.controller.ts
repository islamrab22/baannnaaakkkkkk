import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { productService } from "../services/product.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const productController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.list(req.query as Record<string, string>);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getById(req.params.id);
    res.json(product);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.create(req.body);
    await recordAudit(req, "CREATE", "Product", product.id, { slug: product.slug });
    res.status(201).json(product);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "Product", product.id);
    res.json(product);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await productService.delete(req.params.id);
    await recordAudit(req, "DELETE", "Product", req.params.id);
    res.status(204).send();
  }),

  // Public storefront endpoints
  publicList: asyncHandler(async (req: Request, res: Response) => {
    const group = (req.query.group as string) ?? "ACCOUNT";
    const segment = ((req.query.category as string) === "business" ? "BUSINESS" : "PERSONAL");
    const products = await productService.listPublic(group, segment);
    res.json(products);
  }),

  publicGetBySlug: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getBySlug(req.params.slug);
    res.json(product);
  }),
};
