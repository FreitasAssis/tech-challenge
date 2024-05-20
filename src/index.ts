import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { errors } from "celebrate";
import { syncDb } from "./database/connection";
import router from "./routes/receiverRoutes";
import AppError from "./errors/AppError";
import swaggerUi from "swagger-ui-express";
const swaggerFile = require("./swagger_output.json");

syncDb();

const app = express();

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);
app.use(errors());

app.use((err: Error, request: Request, response: Response) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message });
  }

  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${err.message} `,
  });
});
const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log("\x1b[41m\x1b[37m", `SERVER RUNNIG ON PORT ${port}`, "\x1b[0m")
);
