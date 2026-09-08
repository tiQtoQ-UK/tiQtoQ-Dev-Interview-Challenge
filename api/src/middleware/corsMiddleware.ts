import type { RequestHandler } from "express";

import { config } from "../config.ts";

export const corsMiddleware: RequestHandler = (request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", config.uiOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
};
