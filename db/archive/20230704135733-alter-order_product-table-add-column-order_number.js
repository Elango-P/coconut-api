"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order_product");

        if (tableDefinition && !tableDefinition["order_number"]) {
            await queryInterface.addColumn("order_product", "order_number", {
              type: Sequelize.BIGINT,
              allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order_product");

        if (tableDefinition && tableDefinition["order_number"]) {
            await queryInterface.removeColumn("order_product", "order_number");
        }
    },
};
