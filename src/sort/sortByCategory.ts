import { IPrompt } from "../index";
import CheckExtension from "../class/Extension";
import readFiles from "../common/readFiles";
import fetchCategory from "../common/fetchCategory";
import CheckCategory from "../class/Category";

const sortByCategory = async (data: IPrompt) => {
  const readData = readFiles(data.path);
  const extensions = new CheckExtension(readData);
  await fetchCategory();
};

export default sortByCategory;
