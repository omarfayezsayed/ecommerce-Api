import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express, { NextFunction, Request, Response, urlencoded } from "express";
const app = express();
import morgan from "morgan";
import { connect } from "./config/mongoConnection";
import { categoryRouter } from "./routes/category";
import { connect as redisConnect } from "./config/redisConnection";
import { subCategoryRouter } from "./routes/subCategory";
import { brandRouter } from "./routes/brand";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { reviewRouter } from "./routes/review";
import { handleInvalidRoutes } from "./middlewares/errors/invalidRoutes";
import multer from "multer";

import { errorChain } from "./middlewares/errors/handlingChain";
import { apiError } from "./utils/apiError";
import { productRouter } from "./routes/product";
import { UserRole } from "./rbac/rbacConfig";
import { wishListRouter } from "./routes/withList";

connect();
redisConnect();
// middlewares
if (process.env.ENV_VARIABLE == "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // forms
// app.use(passport. in);
// Routes

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishList", wishListRouter);
app.use("*", handleInvalidRoutes);

// Global error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof apiError) console.log("trueee");
  console.log(err.name, "error name");
  console.log("wholeErr", typeof err);
  errorChain.process(err, req, res, next);
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
