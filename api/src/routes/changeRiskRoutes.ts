import { Router } from "express";

import { analyseChangeController } from "../controllers/changeRiskController.ts";

export const changeRiskRoutes = Router();

changeRiskRoutes.post("/analyse-change", analyseChangeController);
