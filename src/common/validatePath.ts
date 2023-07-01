import isValid from "is-valid-path";
import fs from "fs-extra";

const validatePath = (path: string, simulation: boolean = false): boolean | string => {
  const isValidPath = isValid(path) && (simulation || (fs.existsSync(path) && fs.statSync(path).isDirectory()));

  if (!isValidPath) return "Folder path is not valid!";
  return true;
};

export default validatePath;
