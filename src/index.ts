import chalk from "chalk";
import inquirer from "inquirer";
import validatePath from "./common/validatePath";
import { createSpinner } from "nanospinner";
import simulationMain from "./simulation/index";
import sortByExtension from "./sort/sortByExtension";

export interface IPrompt {
  path: string;
  simulation: boolean;
  sortingAlgorithm: "extension" | "category";
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
    {
      name: "sortingAlgorithm",
      message: "Select a Sorting Algorithm for organizing your files.",
      type: "list",
      choices: ["extension", "category"],
      default: () => "extension",
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

    const start = performance.now();

    if (data.simulation) {
      await simulationMain(data);
    } else {
      spinner.start({ text: "Running Scripts...\n", color: "yellow" });
      await sortByExtension(data);
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
