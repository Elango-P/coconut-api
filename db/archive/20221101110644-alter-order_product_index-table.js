"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order_product_index");

        if (tableDefinition && !tableDefinition["product_name"]) {
            await queryInterface.addColumn(
                "order_product_index",
                "product_name",
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order_product_index");

        if (tableDefinition && tableDefinition["product_name"]) {
            await queryInterface.removeColumn(
                "order_product_index",
                "product_name"
            );
        }
    },
};
