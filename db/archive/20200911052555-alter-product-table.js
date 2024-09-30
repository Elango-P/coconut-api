"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        // if (tableDefinition && tableDefinition["virtual_quantity"]) {
        //     return queryInterface.renameColumn(
        //         "product",
        //         "virtual_quantity",
        //         "shopify_quantity"
        //     );
        // }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["shopify_quantity"]) {
            return queryInterface.renameColumn(
                "product",
                "shopify_quantity",
                "virtual_quantity"
            );
        }
    },
};
