import fs from "fs-extra";
import { ICategory } from "../common/fetchCategory";
import OrganizeLogger from "../logs/logFile";
import sleep from "../common/sleep";
import puppeteer from "puppeteer";

class Category {
  private registeredCategory: ICategory[];

  constructor() {
    this.registeredCategory = JSON.parse(fs.readFileSync("src/data/category.json", { encoding: "utf-8" }));
  }

  get categoryList(): ICategory[] {
    return this.registeredCategory;
  }

  writeCategory = async (data: ICategory[]): Promise<void> => {
    const logger = new OrganizeLogger();
    try {
      fs.writeFileSync("src/data/category.json", JSON.stringify(data));
    } catch (error) {
      logger.error(error.message);
      logger.info("trying to write cache again...");
      await sleep(2000);
      this.writeCategory(data);
    }
  };

  fetchCategory = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const logger = new OrganizeLogger();
    const baseURL = "https://fileinfo.com/filetypes/";

    try {
      logger.info("Go to " + baseURL);
      await Promise.all([page.goto(baseURL, { timeout: 0 }), page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" })]);

      logger.info(`grabbing all category`);
      let categoryGrouping: { href: string; text: string }[][] = await page.$$eval("#left article.browse div.buttongroup.cats", (divs) => {
        return divs.map((div) => {
          const links = Array.from(div.querySelectorAll("a"));
          const hrefs = links.map((link) => ({ href: link.getAttribute("href").split("/").pop(), text: link.textContent }));
          return hrefs;
        });
      });

      for (const div of categoryGrouping) {
        for (const link of div) {
          if (link.href === "common") continue; // Skip "common" link
          const category = new Category();
          const registeredCategory: ICategory[] = category.categoryList;

          // skip registered category
          if (registeredCategory.some((item) => item.category == link.text)) continue;

          logger.info(`Scraping ${link.text}, in ${baseURL}${link.href}`);
          await Promise.all([page.goto(`${baseURL}${link.href}`, { timeout: 0 }), page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" })]);

          logger.info(`grabbing all extension`);
          const linkExtensions: string[] = await page.$$eval("td.extcol a", (elements) => {
            return elements.map((element) => element.textContent);
          });

          registeredCategory.push({ extension: linkExtensions, category: link.text });

          category.writeCategory(registeredCategory);
        }
      }
    } catch (error) {
      logger.error(error);
    } finally {
      await browser.close();
    }
  };
}

export default Category;
