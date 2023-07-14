import readFiles from "../common/readFiles";
import checkExtension from "../common/checkExtension";
import fetchExtension from "../common/fetchExtension";
import organize from "../common/organize";

import { IPrompt } from "index";

const sortByExtension = async (data: IPrompt) => {
  const readData = readFiles(data.path);

  const extensions = checkExtension(readData);

  await fetchExtension(extensions);

  organize(readData, data.path);
};

export default sortByExtension;
