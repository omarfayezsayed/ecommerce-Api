import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connect } from "./config/dbConnection";
import { categoryRouter } from "./routes/category";
import { subCategoryRouter } from "./routes/subCategory";
import { brandRouter } from "./routes/brand";
import {
  errorHandler,
  handleInvalidRoutes,
} from "./middlewares/errorMiddlwares";
import "reflect-metadata";

import {
  castError,
  HandledError,
  ErrorHandlingChain,
  errorSender,
  sendDevelopmentError2,
  sendProductionError2,
} from "./middlewares/errorMiddlwares";
dotenv.config();
const app = express();

connect();
// middlewares
if (process.env.ENV_VARIABLE == "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("*", handleInvalidRoutes);
// Global error Handler

const errsender: errorSender = new sendDevelopmentError2();
const castErrorHandler: ErrorHandlingChain = new castError(errsender);
castErrorHandler.setNextHandler(new HandledError(errsender));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  castErrorHandler.process(err, req, res, next);
});

// Server listening
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is listening ${port} `);
});

process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err}`);
  process.exit(1);
});
