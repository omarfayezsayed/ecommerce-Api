import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connect } from "./config/dbConnection";
import { categoryRouter } from "./routes/category";
import { subCategoryRouter } from "./routes/subCategory";
import {
  errorHandler,
  handleInvalidRoutes,
} from "./middlewares/errorMiddlwares";

dotenv.config();
const app = express();

connect();
// middlewares
if (process.env.ENV_VARIABLE == "development") {
  app.use(morgan("tiny"));
}
app.use(express.json());

// Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("*", handleInvalidRoutes);
// Global error Handler
app.use(errorHandler);

// Server listening
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is listening ${port} `);
});

process.on("unhandledRejection", (err) => {
  console.log("-----------------------");
  console.error(`unhandledRejection Errors ${err}`);
  process.exit(1);
});
