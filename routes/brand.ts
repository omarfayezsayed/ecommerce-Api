import express from "express";

const brandRouter = express.Router();

brandRouter.route("/").get().post();

brandRouter.route("/:id").get().patch().delete();
