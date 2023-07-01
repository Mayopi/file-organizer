import fs from "fs-extra";
import { IStructure } from "./readFiles";
import { IRegisteredExtension } from "./checkExtension";

const organize = (data: IStructure[], path: string): void => {
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

export default organize;
