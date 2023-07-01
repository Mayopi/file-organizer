import fs from "fs-extra";
import { IStructure } from "./readFiles";

export interface IRegisteredExtension {
  extension: string;
  description: string;
}

const checkExtension = (data: IStructure[]): string[] => {
  const registeredExtensions: IRegisteredExtension[] = JSON.parse(fs.readFileSync("src/data/extension.json", { encoding: "utf-8" }));

  const uniqueExtensions = new Set<string>();

  data.map((directoryEntry) => {
    directoryEntry.files.map((file) => {
      uniqueExtensions.add(file.extension);
    });
  });

  const notRegisteredExtensions: string[] = Array.from(uniqueExtensions).filter((ext) => {
    return !registeredExtensions.some((registeredExt) => registeredExt.extension === ext);
  });

  return notRegisteredExtensions;
};

export default checkExtension;
