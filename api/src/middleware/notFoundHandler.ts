import type { RequestHandler, Response } from "express";
import type { ApiErrorResponse } from "@dev-interview-challenge/shared/types";

export const notFoundHandler: RequestHandler = (
  _request,
  response: Response<ApiErrorResponse>,
) => {
  response.status(404).json({ error: "Not found." });
};
