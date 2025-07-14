import { Request } from "express";
import { Query } from "mongoose";
export class apiFeatures {
  private request: Request;
  public query: Query<any, any>;

  constructor(req: Request, query: Query<any, any>) {
    this.request = req;
    this.query = query;
  }
  public pagination() {
    if (this.request.query.page) {
      console.log(Number(this.request.query.page));
      const page = Number(this.request.query.page) || 1;
      const limit = Number(this.request.query.limit) || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
    return this;
  }
  public fieldlimits() {
    if (this.request.query.fields) {
      const fields = String(this.request.query.fields).split(",").join(" ");
      console.log(fields);
      this.query = this.query.select(fields);
      return this;
    }
    return this;
  }
}
