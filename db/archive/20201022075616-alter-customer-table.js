"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("customer");

        if (tableDefinition && !tableDefinition["store_id"]) {
            await queryInterface.addColumn("customer", "store_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["store_customer_id"]) {
            await queryInterface.addColumn("customer", "store_customer_id", {
                type: Sequelize.BIGINT,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("customer");

        if (tableDefinition && tableDefinition["store_id"]) {
            await queryInterface.removeColumn("customer", "store_id");
        }

        if (tableDefinition && tableDefinition["store_customer_id"]) {
            await queryInterface.removeColumn("customer", "store_customer_id");
        }
    },
};
