"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order_product");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("order_product", "status", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order_product");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("order_product", "status");
        }
    },
};
