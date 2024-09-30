"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "product_image"
        );

        if (tableDefinition && !tableDefinition["shopify_status"]) {
            await queryInterface.addColumn("product_image", "shopify_status", {
                type: Sequelize.STRING,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "product_image"
        );

        if (tableDefinition && tableDefinition["shopify_status"]) {
            await queryInterface.removeColumn(
                "product_image",
                "shopify_status"
            );
        }
    },
};
