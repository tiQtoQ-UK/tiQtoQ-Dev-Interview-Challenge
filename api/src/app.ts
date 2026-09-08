import express from "express";

import { changeRiskRoutes } from "./routes/changeRiskRoutes.ts";
import { healthRoutes } from "./routes/healthRoutes.ts";
import { corsMiddleware } from "./middleware/corsMiddleware.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { notFoundHandler } from "./middleware/notFoundHandler.ts";

export function createApp() {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json({ limit: "16kb" }));

  app.use(healthRoutes);
  app.use(changeRiskRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
