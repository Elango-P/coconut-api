"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("replenish_index");

        if (tableDefinition && tableDefinition["order_count"]) {
            return queryInterface.renameColumn(
                "replenish_index",
                "order_count",
                "order_quantity"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("replenish_index");

        if (tableDefinition && tableDefinition["order_count"]) {
            return queryInterface.renameColumn(
                "replenish_index",
                "order_count",
                "order_quantity"
            );
        }
    },
};
