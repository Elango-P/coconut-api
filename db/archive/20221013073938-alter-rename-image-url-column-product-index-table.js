"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_index");

        if (tableDefinition && tableDefinition["image_url"]) {
            return queryInterface.renameColumn(
                "product_index",
                "image_url",
                "product_media_url"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_index");

        if (tableDefinition && tableDefinition["product_media_url"]) {
            return queryInterface.renameColumn(
                "product_index",
                "product_media_url",
                "image_url"
            );
        }
    },
};
