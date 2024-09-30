"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && !tableDefinition["order_number"]) {
            await queryInterface.addColumn("order", "order_number", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

        if (tableDefinition && tableDefinition["total"]) {
            await queryInterface.changeColumn("order", "total", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && tableDefinition["order_number"]) {
            await queryInterface.removeColumn("order", "order_number");
        }

        if (tableDefinition && !tableDefinition["total"]) {
            await queryInterface.addColumn("order", "total", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }
    },
};
