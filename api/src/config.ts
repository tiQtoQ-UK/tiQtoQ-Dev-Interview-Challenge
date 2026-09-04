export const config = {
  port: Number(process.env.PORT ?? 4000),
  uiOrigin: process.env.UI_ORIGIN ?? "http://localhost:3000",
};
