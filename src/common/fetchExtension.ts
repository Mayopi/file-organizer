import dotenv from "dotenv";
import fs from "fs-extra";
import axios from "axios";
import { IRegisteredExtension } from "./checkExtension";
import chalk from "chalk";

dotenv.config();

const sleep = (ms = 5000) => new Promise((r) => setTimeout(r, ms));

const fetchExtension = async (unregisteredExtensions: string[]): Promise<string[]> => {
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

    console.log(chalk.blue(`\nFetching Extension ${extension} -> ${(((index + 1) / unregisteredExtensions.length) * 100).toFixed(2)}%\nSuccess to cache ${description?.data?.fullName || "Unknown FIles"}`));

    await sleep(3000);

    const remainingDescription = await fetchNext(index + 1);

    return [description?.data?.fullName, ...remainingDescription];
  };
  return await fetchNext(0);
};

export default fetchExtension;
