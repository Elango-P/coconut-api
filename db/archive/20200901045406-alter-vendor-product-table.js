"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && tableDefinition["image"]) {
            await queryInterface.removeColumn("vendor_product", "image");
        }

        if (tableDefinition && tableDefinition["images"]) {
            await queryInterface.removeColumn("vendor_product", "images");
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && !tableDefinition["image"]) {
            await queryInterface.addColumn("vendor_product", "image");
        }

        if (tableDefinition && !tableDefinition["images"]) {
            await queryInterface.addColumn("vendor_product", "images");
        }
    },
};
