import type { Request, Response } from "express";
import { analyseChangeRisk } from "@dev-interview-challenge/shared";
import type {
  ApiErrorResponse,
  ChangeRiskRequest,
  ChangeRiskResponse,
} from "@dev-interview-challenge/shared/types";

export function analyseChangeController(
  request: Request<
    never,
    ChangeRiskResponse | ApiErrorResponse,
    Partial<ChangeRiskRequest>
  >,
  response: Response<ChangeRiskResponse | ApiErrorResponse>,
) {
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
}
