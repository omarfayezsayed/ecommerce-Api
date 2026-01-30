import { Request } from "express";
import { Query } from "mongoose";
export class queryBuilder {
  private options: any;
  public query: Query<any, any>;

  constructor(query: Query<any, any>, options: any) {
    this.query = query;
    this.options = options;
    return this;
  }
  public pagination() {
    if (this.options.page) {
      const page = Number(this.options.page) || 1;
      const limit = Number(this.options.limit) || 10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
  public fieldlimits() {
    if (this.options.fields) {
      const populatedfields = String(this.options.fields).split(",");
      populatedfields.forEach((field) => {
        this.query = this.query.populate({
          path: field,
          strictPopulate: false,
        });
      });
      const selectedFields = String(this.options.fields).split(",").join("");
      this.query = this.query.select(selectedFields);
    }
    return this;
  }
  public sort() {
    if (this.options.sort) {
      const sortString = String(this.options.sort).split(",").join(" ");
      this.query = this.query.sort(sortString);
    }
    return this;
  }
  public filter() {
    if (this.options.filter) {
      this.query = this.query.find(this.options.filter);
    }
    return this;
  }
  public build() {
    return this.query;
  }
}
