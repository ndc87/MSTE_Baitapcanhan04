const Category = require('../models/Category');
const response = require('../utils/response');

exports.listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    return response.success(res, {
      message: 'Categories fetched successfully',
      data: {
        items: categories.map((category) => ({
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          description: category.description || ''
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
