import readFiles from "../common/readFiles";
import Extension from "../common/Extension";

import { IPrompt } from "index";

const sortByExtension = async (data: IPrompt) => {
  const readData = readFiles(data.path);

  const extension = new Extension(readData);

  const unregisteredExtensionList = extension.unregisteredExtensions;

  await extension.fetchExtension(unregisteredExtensionList);

  extension.organize(readData, data.path);
};

export default sortByExtension;
