"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "recurring_task"
        );

        if (tableDefinition && !tableDefinition["account_id"]) {
            await queryInterface.addColumn("recurring_task", "account_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["amount"]) {
            await queryInterface.addColumn("recurring_task", "amount", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "recurring_task"
        );

        if (tableDefinition && tableDefinition["account_id"]) {
            await queryInterface.removeColumn(
                "recurring_task",
                "account_id"
            );
        }

        if (tableDefinition && tableDefinition["amount"]) {
            await queryInterface.removeColumn(
                "recurring_task",
                "amount"
            );
        }

    },
};
