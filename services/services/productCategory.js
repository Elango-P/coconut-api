/**
 * Module dependencies
 */

const Category= require("../../helpers/Category");

// Models
const { product_category } = require("../../db").models;

module.exports = {
    /**
     * Create Product Category
     */
    getProductCategoryId: async categoryName => {
        if (!categoryName) {
            return null;
        }

        const categoryExist = await product_category.findOne({
            where: { name: categoryName, status: Category.STATUS_ACTIVE },
        });

        // Validate category name exist
        if (categoryExist) {
            return categoryExist.id;
        } else {
            const newCategoryData = {
                name: categoryName,
                status: Category.STATUS_ACTIVE,
            };

            // Create new category
            const newCategory = await product_category.create(newCategoryData);
            return newCategory.id;
        }
    },
};
