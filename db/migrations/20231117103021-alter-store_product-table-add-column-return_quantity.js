"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store_product");

        if (tableDefinition && !tableDefinition["return_quantity"]) {
            await queryInterface.addColumn("store_product", "return_quantity", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["system_quantity"]) {
            await queryInterface.addColumn("store_product", "system_quantity", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store_product");

        if (tableDefinition && tableDefinition["return_quantity"]) {
            await queryInterface.removeColumn("store_product", "return_quantity");
        }

        if (tableDefinition && tableDefinition["system_quantity"]) {
            await queryInterface.removeColumn("store_product", "system_quantity");
        }
    },
};
