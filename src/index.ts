import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs-extra";
import validatePath from "./common/validatePath";
import { createSpinner } from "nanospinner";
import readFiles from "./common/readFiles";
import checkExtension from "./common/checkExtension";
import fetchExtension from "./common/fetchExtension";

interface IPrompt {
  path: string;
  simulation: boolean;
}

const prompt = async (): Promise<IPrompt> => {
  const data = await inquirer.prompt([
    {
      name: "path",
      message: "Type your clumpsy folder path",
      type: "input",
      validate: (path: string): boolean | string => validatePath(path),
    },

    {
      name: "simulation",
      message: `Do you want to run demo? ${chalk.bold.yellow("this will copy all your files and organize them instead of make any changes to original source")}`,
      type: "confirm",
      default: () => false,
    },
  ]);

  return data;
};

const main = async (): Promise<void> => {
  console.log(`
Welcome to ${chalk.blue("File Organizer")}

We are providing file organizer system to automatically organize your files

Build by ${chalk.blue("@Mayopi")} on Github
${chalk.underline.blue("https://github.com/Mayopi")}
`);

  const spinner = createSpinner();

  try {
    const data = await prompt();

    let start = performance.now();

    if (data.simulation) {
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

      start = performance.now();

      fs.cpSync(data.path, simulationDestination.path, { recursive: true });
    }

    spinner.start({ text: "Running Scripts...", color: "yellow" });
    const readData = readFiles(data.path);

    const extensions = checkExtension(readData);

    const descriptions = await fetchExtension(extensions);

    if (descriptions) {
      spinner.success({ text: `Success re organizing all files within ${chalk.blue(((performance.now() - start) / 1000).toFixed(2))} seconds.` });
    }
  } catch (error) {
    console.log(error);
    spinner.error({ text: error.message });
  } finally {
    spinner.clear();
  }
};

main();
