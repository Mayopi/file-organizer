import { IPrompt } from "index";
import validatePath from "../common/validatePath";
import inquirer from "inquirer";
import fs from "fs-extra";
import sortByExtension from "../sort/sortByExtension";
import sortByCategory from "../sort/sortByCategory";
import { createSpinner } from "nanospinner";
import chalk from "chalk";

const simulationMain = async (data: IPrompt): Promise<void> => {
  const simulationDestination: IPrompt = await inquirer.prompt([
    {
      name: "path",
      message: "Type your demo folder path destination",
      type: "input",
      validate: (path: string): boolean | string => validatePath(path, true),
    },
  ]);

  const start = performance.now();

  const spinner = createSpinner();

  spinner.start({ text: "Running Scripts...\n", color: "yellow" });

  if (!fs.existsSync(simulationDestination.path) || !fs.statSync(simulationDestination.path).isDirectory()) {
    fs.mkdirSync(simulationDestination.path, { recursive: true });
  }

  fs.cpSync(data.path, simulationDestination.path, { recursive: true });

  data.path = simulationDestination.path;

  // sort by extension

  if (data.sortingAlgorithm == "extension") {
    await sortByExtension(data);
  }

  // sort by category

  if (data.sortingAlgorithm == "category") {
    sortByCategory(data);
  }

  spinner.success({ text: `Success re organizing all files within ${chalk.blue(((performance.now() - start) / 1000).toFixed(2))} seconds.` });
};

export default simulationMain;
