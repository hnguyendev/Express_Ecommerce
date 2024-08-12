require("dotenv").config();
import { Server } from "./server";

const app = new Server().app;

app.listen(process.env.PORT, async () => {
  console.log(`Server connected on port ${process.env.PORT}`);
});
