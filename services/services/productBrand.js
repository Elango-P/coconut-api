/**
 * Module dependencies
 */

const Brand = require("../../helpers/Brand");

const { product_brand } = require("../../db").models;


module.exports = {
    /**
     * Create Product Brand
     */
    getProductBrandId: async brandName => {
        if (!brandName) {
            return null;
        }

        const brandExist = await product_brand.findOne({
            where: { name: brandName },
        });

        // Validate brand name exist
        if (brandExist) {
            return brandExist.id;
        } else {
            const newBrandData = {
                name: brandName,
                status: Brand.STATUS_ACTIVE,
            };

            // Create new brand
            const newBrand = await product_brand.create(newBrandData);
            return newBrand.id;
        }
    },
};
