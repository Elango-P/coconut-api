"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "product_image"
        );

        if (tableDefinition && tableDefinition["shopify_id"]) {
            await queryInterface.removeColumn("product_image", "shopify_id");
        }

        if (tableDefinition && tableDefinition["shopify_status"]) {
            await queryInterface.removeColumn(
                "product_image",
                "shopify_status"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "product_image"
        );

        if (tableDefinition && !tableDefinition["shopify_status"]) {
            await queryInterface.addColumn("product_image", "shopify_status", {
                type: Sequelize.STRING,
            });
        }

        if (tableDefinition && !tableDefinition["shopify_id"]) {
            await queryInterface.addColumn("product_image", "shopify_id", {
                type: Sequelize.STRING,
            });
        }
    },
};
