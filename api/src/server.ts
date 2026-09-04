import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";

import {
  type ApiErrorResponse,
  type ChangeRiskRequest,
  type ChangeRiskResponse,
} from "@dev-interview-challenge/shared/types";

import { analyseChangeRisk } from "@dev-interview-challenge/shared";

const PORT = Number(process.env.PORT ?? 4000);
const UI_ORIGIN = process.env.UI_ORIGIN ?? "http://localhost:3000";

const app = express();

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", UI_ORIGIN);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json({ limit: "16kb" }));

app.get("/health", (_request: Request, response: Response) => {
  response.json({ status: "ok" });
});

app.post(
  "/analyse-change",
  (
    request: Request<
      never,
      ChangeRiskResponse | ApiErrorResponse,
      Partial<ChangeRiskRequest>
    >,
    response: Response<ChangeRiskResponse | ApiErrorResponse>,
  ) => {
    const { description } = request.body;

    if (typeof description !== "string" || description.trim().length === 0) {
      response
        .status(400)
        .json({ error: "Please provide a change description." });
      return;
    }

    if (description.length > 2_000) {
      response.status(400).json({
        error: "Please keep the change description under 2,000 characters.",
      });
      return;
    }

    response.json({
      analysis: analyseChangeRisk(description),
    });
  },
);

app.use((_request, response: Response<ApiErrorResponse>) => {
  response.status(404).json({ error: "Not found." });
});

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ error: "Request body must be valid JSON." });
    return;
  }

  if (error?.type === "entity.too.large") {
    response.status(413).json({ error: "Request body is too large." });
    return;
  }

  console.error(error);
  response
    .status(500)
    .json({ error: "Unable to analyse the change right now." });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Change Risk API listening on http://localhost:${PORT}`);
});
