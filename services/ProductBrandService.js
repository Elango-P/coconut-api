/**
 * Module dependencies
 */

const { Sequelize } = require("sequelize");
const Brand = require ("../helpers/Brand");

const { productBrand } = require("../db").models;

module.exports = {
    /**
     * Create Product Brand
     */
    getProductBrandId: async (brandName, companyId) => {
        try{
        if (!brandName) {
            return null;
        }

        const brandExist = await productBrand.findOne({
            where: {
                [Sequelize.Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), brandName.toLowerCase()),
                ]
            },
        });

        // Validate brand name exist
        if (brandExist) {
            return brandExist.id;
        } else {
            const newBrandData = {
                name: brandName,
                status: Brand.STATUS_ACTIVE,
                company_id: companyId
            };

            // Create new brand
            const newBrand = await productBrand.create(newBrandData);
            return newBrand.id;
        }
    }catch(err){
        console.log(err);
    }
    },
};
