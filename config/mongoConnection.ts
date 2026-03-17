import mongoose from "mongoose";
import { seedRoles } from "../rbac/rbackSeed";
export const connect = () => {
  mongoose
    .connect(`${process.env.DB_CONNECTION_STRING}`)
    .then(async (res) => {
      await seedRoles();
      console.log("dB connected successfully");
    })
    .catch((err) => {
      console.log("error connected to database");
    });
};
