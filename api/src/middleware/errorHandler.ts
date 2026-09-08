import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
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
