"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "store_product"
        );

        if (tableDefinition && tableDefinition["price"]) {
            await queryInterface.removeColumn("store_product", "price");
        }

        if (tableDefinition && tableDefinition["sale_price"]) {
            await queryInterface.removeColumn("store_product", "sale_price");
        }

        if (tableDefinition && tableDefinition["quantity"]) {
            await queryInterface.removeColumn("store_product", "quantity");
        }

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("store_product", "status");
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "store_product"
        );

        if (tableDefinition && !tableDefinition["price"]) {
            await queryInterface.addColumn("store_product", "price", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["sale_price"]) {
            await queryInterface.addColumn("store_product", "sale_price", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["quantity"]) {
            await queryInterface.addColumn("store_product", "quantity", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("store_product", "status", {
                type: Sequelize.STRING,
            });
        }
    },
};
