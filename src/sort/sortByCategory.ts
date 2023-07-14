import { IPrompt } from "../index";
import CheckExtension from "../common/checkExtension";
import readFiles from "../common/readFiles";

const sortByCategory = async (data: IPrompt) => {
  const readData = readFiles(data.path);
  const extensions = new CheckExtension(readData);

  const extensionList = extensions.extensionList;

  console.log(extensionList);
};

export default sortByCategory;
