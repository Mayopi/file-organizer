import fs from "fs-extra";
import { IStructure } from "./readFiles";

export interface IRegisteredExtension {
  extension: string;
  description: string;
}

class CheckExtension {
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

  get unregisteredExtension(): string[] {
    const notRegisteredExtensions: string[] = this.extensionList.filter((ext) => {
      return !this.registeredExtensions.some((registeredExt) => registeredExt.extension === ext);
    });

    return notRegisteredExtensions;
  }
}

export default CheckExtension;
