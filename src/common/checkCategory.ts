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

  get unregisteredCategory(): string[] {
    const registeredCategories = this.registeredCategory.map((category) => category.extension);
    const unregisteredCategories = this.data.filter((category) => !registeredCategories.includes(category));
    return unregisteredCategories;
  }
}

export default CheckCategory;
