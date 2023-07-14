import { IPrompt } from "../index";
import CheckExtension from "../common/checkExtension";
import readFiles from "../common/readFiles";
import fetchCategory from "../common/fetchCategory";
import CheckCategory from "../common/checkCategory";

const sortByCategory = async (data: IPrompt) => {
  const readData = readFiles(data.path);
  const extensions = new CheckExtension(readData);

  const extensionList: string[] = extensions.extensionList;

  const category = new CheckCategory(extensionList);

  const unregisteredCategories = category.unregisteredCategory;

  await fetchCategory(unregisteredCategories);
};

export default sortByCategory;
