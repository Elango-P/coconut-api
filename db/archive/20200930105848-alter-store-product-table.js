"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "store_product"
        );

        if (tableDefinition && tableDefinition["price"]) {
            await queryInterface.changeColumn("store_product", "price", {
                type: Sequelize.DECIMAL,
            });
        }

        if (tableDefinition && tableDefinition["sale_price"]) {
            await queryInterface.changeColumn("store_product", "sale_price", {
                type: Sequelize.DECIMAL,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "store_product"
        );

        if (tableDefinition && tableDefinition["price"]) {
            await queryInterface.changeColumn("store_product", "price", {
                type: Sequelize.INTEGER,
            });
        }

        if (tableDefinition && tableDefinition["sale_price"]) {
            await queryInterface.changeColumn("store_product", "sale_price", {
                type: Sequelize.INTEGER,
            });
        }
    },
};
