import { Router } from "express";

import { healthController } from "../controllers/healthController.ts";

export const healthRoutes = Router();

healthRoutes.get("/health", healthController);
