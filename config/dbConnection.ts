import mongoose from "mongoose";

export const connect = () => {
  mongoose.connect(`${process.env.DB_CONNECTION_STRING}`).then((res): void => {
    console.log("dB connected successfully");
  });
};
