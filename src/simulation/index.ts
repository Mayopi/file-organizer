import { IPrompt } from "index";
import validatePath from "../common/validatePath";
import inquirer from "inquirer";
import fs from "fs-extra";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import sortByExtension from "../sort/sortByExtension";

const simulationMain = async (data: IPrompt) => {
  const spinner = createSpinner();

  const simulationDestination: IPrompt = await inquirer.prompt([
    {
      name: "path",
      message: "Type your demo folder path destination",
      type: "input",
      validate: (path: string): boolean | string => validatePath(path, true),
    },
  ]);

  if (!fs.existsSync(simulationDestination.path) || !fs.statSync(simulationDestination.path).isDirectory()) {
    fs.mkdirSync(simulationDestination.path, { recursive: true });
  }

  const start = performance.now();

  fs.cpSync(data.path, simulationDestination.path, { recursive: true });

  data.path = simulationDestination.path;

  if (data.sortingAlgorithm == "extension") {
    spinner.start({ text: "Running Scripts...\n", color: "yellow" });
    sortByExtension(data);
    spinner.success({ text: `Success re organizing all files within ${chalk.blue(((performance.now() - start) / 1000).toFixed(2))} seconds.` });
  }
};

export default simulationMain;
