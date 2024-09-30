"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store");

        // if (tableDefinition && tableDefinition["shopify_shop_name"]) {
        //     await queryInterface.renameColumn(
        //         "store",
        //         "shopify_shop_name",
        //         "shopify_store_name"
        //     );
        // }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store");

        if (tableDefinition && tableDefinition["shopify_store_name"]) {
            await queryInterface.renameColumn(
                "store",
                "shopify_store_name",
                "shopify_shop_name"
            );
        }
    },
};
