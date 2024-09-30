"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "recurring_task"
        );

        if (tableDefinition && !tableDefinition["object_id"]) {
            await queryInterface.addColumn("recurring_task", "object_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["object_name"]) {
            await queryInterface.addColumn("recurring_task", "object_name", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "recurring_task"
        );

        if (tableDefinition && tableDefinition["object_id"]) {
            await queryInterface.removeColumn(
                "recurring_task",
                "object_id"
            );
        }

        if (tableDefinition && tableDefinition["object_name"]) {
            await queryInterface.removeColumn(
                "recurring_task",
                "object_name"
            );
        }



    },
};
