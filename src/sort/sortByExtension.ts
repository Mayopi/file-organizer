import readFiles from "../common/readFiles";
import CheckExtension from "../common/checkExtension";
import fetchExtension from "../common/fetchExtension";
import organize from "../common/organize";

import { IPrompt } from "index";

const sortByExtension = async (data: IPrompt) => {
  const readData = readFiles(data.path);

  const extension = new CheckExtension(readData);

  const unregisteredExtensionList = extension.unregisteredExtension;

  await fetchExtension(unregisteredExtensionList);

  organize(readData, data.path);
};

export default sortByExtension;
