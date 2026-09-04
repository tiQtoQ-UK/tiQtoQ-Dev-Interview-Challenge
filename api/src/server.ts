import { createApp } from "./app.ts";
import { config } from "./config.ts";

const app = createApp();

app.listen(config.port, () => {
  console.log(`Change Risk API listening on http://localhost:${config.port}`);
});
