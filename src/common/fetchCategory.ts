import puppeteer from "puppeteer";
import fs from "fs-extra";
import OrganizeLogger from "../logs/logFile";

export interface ICategory {
  extension: string[];
  category: string;
}

const sleep = (ms: number = 5000) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCategory = async () => {
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

        const registeredCategory: ICategory[] = JSON.parse(fs.readFileSync("src/data/category.json", { encoding: "utf-8" }));

        // skip registered category
        if (registeredCategory.some((item) => item.category == link.text)) continue;

        logger.info(`Scraping ${link.text}, in ${baseURL}${link.href}`);
        await Promise.all([page.goto(`${baseURL}${link.href}`, { timeout: 0 }), page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" })]);

        logger.info(`grabbing all extension`);
        const linkExtensions: string[] = await page.$$eval("td.extcol a", (elements) => {
          return elements.map((element) => element.textContent);
        });

        registeredCategory.push({ extension: linkExtensions, category: link.text });

        fs.writeFileSync("src/data/category.json", JSON.stringify(registeredCategory));
        console.log(linkExtensions);

        await Promise.all([page.goBack({ timeout: 0 }), page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" })]);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
};

export default fetchCategory;
