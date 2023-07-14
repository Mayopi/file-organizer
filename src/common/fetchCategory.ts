import puppeteer from "puppeteer";
import fs from "fs-extra";
import chalk from "chalk";
import OrganizeLogger from "../logs/logFile";

export interface ICategory {
  extension: string;
  category: string;
}

const sleep = (ms: number = 5000) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCategory = async (extensions: string[]) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const logger = new OrganizeLogger();

  const fetchNext = async (index: number, results: ICategory[]): Promise<ICategory[]> => {
    if (index >= extensions.length) return results;

    const registeredCategories: ICategory[] = JSON.parse(fs.readFileSync("src/data/category.json", { encoding: "utf-8" }));

    logger.info(chalk.blue(`Going to https://fileinfo.com/`));
    await page.goto("https://fileinfo.com/");

    let inputSelector = "#main > div.homeSearch > div.searchwrapper > form > div > input";
    let submitButtonSelector = "#main > div.homeSearch > div.searchwrapper > form > div > button";

    let categorySelector = "div.entryHeader > table > tbody > tr:nth-child(3) > td:nth-child(2) > a";

    logger.info(chalk.blue(`Searching ${extensions[index]} category`));
    await Promise.all([page.type(inputSelector, extensions[index]), page.click(submitButtonSelector), page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" })]);

    logger.info(chalk.blue(`Grab the category information`));
    const category: string = await page.$eval(categorySelector, (element) => element.textContent);

    logger.info(chalk.blue(`Wait for 3 seconds`));
    await sleep(3000);

    const result: ICategory = {
      extension: extensions[index],
      category,
    };

    registeredCategories.push(result);

    fs.writeFileSync("src/data/category.json", JSON.stringify(registeredCategories));
    logger.info(chalk.blue(`Success caching ${category}`));

    logger.info(chalk.blue(`Go back to home after grabbing ${category}`));
    await Promise.all([page.goBack(), page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" })]);

    return fetchNext(index + 1, [...results, result]);
  };

  const category = await fetchNext(0, []);

  await browser.close();

  return category;
};

export default fetchCategory;
