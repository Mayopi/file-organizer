import Category from "../class/Category";

const sortByCategory = async () => {
  const category = new Category();
  await category.fetchCategory();
};

export default sortByCategory;
