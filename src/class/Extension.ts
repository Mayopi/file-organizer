import fs from "fs-extra";
import { IStructure } from "../common/readFiles";
import dotenv from "dotenv";
import axios from "axios";
import chalk from "chalk";
import OrganizeLogger from "../logs/logFile";
import sleep from "../common/sleep";
dotenv.config();

export interface IRegisteredExtension {
  extension: string;
  description: string;
}

class Extension {
  data: IStructure[];
  private registeredExtensions: IRegisteredExtension[];
  constructor(data: IStructure[]) {
    this.data = data;
    this.registeredExtensions = JSON.parse(fs.readFileSync("src/data/extension.json", { encoding: "utf-8" }));
  }

  get extensionList(): string[] {
    const uniqueExtensions = new Set<string>();

    this.data.map((directoryEntry) => {
      directoryEntry.files.map((file) => {
        uniqueExtensions.add(file.extension);
      });
    });

    return Array.from(uniqueExtensions);
  }

  get unregisteredExtensions(): string[] {
    const notRegisteredExtensions: string[] = this.extensionList.filter((ext) => {
      return !this.registeredExtensions.some((registeredExt) => registeredExt.extension === ext);
    });

    return notRegisteredExtensions;
  }

  fetchExtension = async (unregisteredExtensions: string[]) => {
    const logger = new OrganizeLogger();

    const fetchNext = async (index: number): Promise<string[]> => {
      if (index >= unregisteredExtensions.length) return [];
      const registeredExtensions: IRegisteredExtension[] = JSON.parse(fs.readFileSync("src/data/extension.json", { encoding: "utf-8" }));

      const extension = unregisteredExtensions[index];
      const description = await axios.get("https://file-extension.p.rapidapi.com/details", {
        headers: {
          "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
          "X-RapidAPI-Host": "file-extension.p.rapidapi.com",
        },

        params: {
          extension: extension.split(".")[1],
        },
      });

      registeredExtensions.push({ extension, description: description?.data?.fullName || "Unknown Files" });

      fs.writeFileSync("src/data/extension.json", JSON.stringify(registeredExtensions));

      logger.info(chalk.blue(`Fetching Extension ${extension} -> ${(((index + 1) / unregisteredExtensions.length) * 100).toFixed(2)}% Success to cache ${description?.data?.fullName || "Unknown FIles"}\n`));

      await sleep(3000);

      const remainingDescription = await fetchNext(index + 1);

      return [description?.data?.fullName, ...remainingDescription];
    };
    return await fetchNext(0);
  };

  organize = (data: IStructure[], path: string): void => {
    const logger = new OrganizeLogger();
    const regirestedExtension: IRegisteredExtension[] = JSON.parse(fs.readFileSync("src/data/extension.json", { encoding: "utf-8" }));

    data.map((directoryEntry) => {
      directoryEntry.files.map((file) => {
        const details = regirestedExtension.find((registeredExt) => file.extension == registeredExt.extension);

        let fileTrackerPath: string = `${path}\\file-tracker.log`;

        if (!fs.existsSync(fileTrackerPath)) {
          fs.writeFileSync(fileTrackerPath, "File Tracker History\n\n");
        }

        if (!fs.existsSync(`${directoryEntry.directory}\\${details.description}`)) {
          fs.mkdirSync(`${directoryEntry.directory}\\${details.description}`, { recursive: true });
        }

        logger.success(`Moved file ${file.name}`);

        fs.renameSync(`${directoryEntry.directory}\\${file.name}`, `${directoryEntry.directory}\\${details.description}\\${file.name}`);

        const trackerEntry = `
  Timestamp:  ${Date.now()}
  Moved file: ${directoryEntry.directory}\\${file.name} 
  To:         ${directoryEntry.directory}\\${details.description}\\${file.name}\n\n
                    `;

        fs.appendFileSync(fileTrackerPath, trackerEntry);
      });
    });
  };
}

export default Extension;
