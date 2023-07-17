import { IPrompt } from "../index";
import CheckExtension from "../common/Extension";
import readFiles from "../common/readFiles";
import fetchCategory from "../common/fetchCategory";
import CheckCategory from "../common/Category";

const sortByCategory = async (data: IPrompt) => {
  const readData = readFiles(data.path);
  const extensions = new CheckExtension(readData);
  await fetchCategory();
};

export default sortByCategory;
