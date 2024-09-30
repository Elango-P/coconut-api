"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["publish_status"]) {
            return queryInterface.renameColumn(
                "product",
                "publish_status",
                "shopify_status"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["shopify_status"]) {
            return queryInterface.renameColumn(
                "product",
                "shopify_status",
                "publish_status"
            );
        }
    },
};
