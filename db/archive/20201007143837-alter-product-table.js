"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("product", "status");
        }

        if (tableDefinition && tableDefinition["shopify_status"]) {
            await queryInterface.renameColumn(
                "product",
                "shopify_status",
                "status"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.renameColumn(
                "product",
                "status",
                "shopify_status"
            );
        }

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("product", "status", {
                type: Sequelize.STRING,
            });
        }
    },
};
