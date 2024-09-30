"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && tableDefinition["shopify_product_id"]) {
                return queryInterface.changeColumn(
                    "product",
                    "shopify_product_id",
                    {
                        type: Sequelize.STRING,
                        allowNull: true,
                    }
                );
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
