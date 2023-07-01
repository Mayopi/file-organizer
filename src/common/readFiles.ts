import fs from "fs-extra";
import { join, extname } from "path";

interface file {
  extension: string;
  name: string;
}

interface IStructure {
  directory: string;
  files: file[];
}

const readFiles = (path: string): IStructure[] => {
  // define allFiles types
  let allFiles: IStructure[] = [
    {
      directory: path,
      files: [],
    },
  ];

  //   read all files and include directory

  const directoryEntries = fs.readdirSync(path, { withFileTypes: true });

  for (const entry of directoryEntries) {
    // for every file (include sub directory) entry, get full path with join func
    const fullPath = join(path, entry.name);

    // check if entry is an subdirectory
    if (entry.isDirectory()) {
      // get all files in the sub directory with its sub directory (if exist) using recursion
      const nestedFiles = readFiles(fullPath);
      //   concat the allFiles array
      allFiles = allFiles.concat(nestedFiles);
    } else {
      // then create a file object based on file types
      const file: file = {
        extension: extname(entry.name),
        name: entry.name,
      };

      //   push the object into allFiles.files

      allFiles[0].files.push(file);
    }
  }

  return allFiles;
};

export default readFiles;
