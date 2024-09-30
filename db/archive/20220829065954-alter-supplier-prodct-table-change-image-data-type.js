"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "supplier_product_image"
        );
        if (tableDefinition && tableDefinition["image_url"]) {
            await queryInterface.changeColumn(
                "supplier_product_image",
                "image_url",
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                }
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "supplier_product_image"
        );
        if (tableDefinition && tableDefinition["image_url"]) {
            await queryInterface.changeColumn(
                "supplier_product_image",
                "image_url",
                {
                    type: Sequelize.JSON,
                    allowNull: true,
                }
            );
        }
    },
};
