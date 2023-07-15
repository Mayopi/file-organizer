import fs from "fs-extra";
import { ICategory } from "./fetchCategory";

class Category {
  private registeredCategory: ICategory[];

  constructor() {
    this.registeredCategory = JSON.parse(fs.readFileSync("src/data/category.json", { encoding: "utf-8" }));
  }

  get categoryList(): ICategory[] {
    return this.registeredCategory;
  }

  writeCategory(data: ICategory[]): void {
    fs.writeFileSync("src/data/category.json", JSON.stringify(data));
  }
}

export default Category;
