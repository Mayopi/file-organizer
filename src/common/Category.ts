import fs from "fs-extra";
import { ICategory } from "./fetchCategory";
import OrganizeLogger from "../logs/logFile";

class Category {
  private registeredCategory: ICategory[];

  constructor() {
    this.registeredCategory = JSON.parse(fs.readFileSync("src/data/category.json", { encoding: "utf-8" }));
  }

  get categoryList(): ICategory[] {
    return this.registeredCategory;
  }

  writeCategory(data: ICategory[]): void {
    const logger = new OrganizeLogger();
    try {
      fs.writeFileSync("src/data/category.json", JSON.stringify(data));
    } catch (error) {
      logger.error(error.message);
      logger.info("trying to write cache again...");
      this.writeCategory(data);
    }
  }
}

export default Category;
