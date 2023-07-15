import fs from "fs-extra";
import { ICategory } from "./fetchCategory";

class CheckCategory {
  private registeredCategory: ICategory[];
  data: string[];

  constructor(data: string[]) {
    this.data = data;
    this.registeredCategory = JSON.parse(fs.readFileSync("src/data/category.json", { encoding: "utf-8" }));
  }

  get categoryList(): ICategory[] {
    return this.registeredCategory;
  }
}

export default CheckCategory;
