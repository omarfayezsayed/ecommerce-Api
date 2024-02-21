import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connect } from "./config/dbConnection";
import { categoryRouter } from "./routes/category";
import { subCategoryRouter } from "./routes/subCategory";

import { errorHandler } from "./services/errorService";
dotenv.config();
const app = express();
const port = process.env.PORT;

connect();
// middlewares
app.use(morgan("tiny"));
app.use(express.json());

// Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
// Global error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is listening ${port} `);
});
