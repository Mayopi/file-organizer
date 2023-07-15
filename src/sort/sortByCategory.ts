import { IPrompt } from "../index";
import CheckExtension from "../common/checkExtension";
import readFiles from "../common/readFiles";
import fetchCategory from "../common/fetchCategory";
import CheckCategory from "../common/checkCategory";

const sortByCategory = async (data: IPrompt) => {
  const readData = readFiles(data.path);
  const extensions = new CheckExtension(readData);

  const extensionList: string[] = extensions.extensionList;

  await fetchCategory();
};

export default sortByCategory;
