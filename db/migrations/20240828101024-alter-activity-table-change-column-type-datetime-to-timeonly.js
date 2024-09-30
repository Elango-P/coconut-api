"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "activity"
        );

        if (tableDefinition && tableDefinition["completed_at"]) {
            await queryInterface.changeColumn("activity", "completed_at", {
                type: Sequelize.TIME,
            });
        }

        if (tableDefinition && tableDefinition["started_at"]) {
            await queryInterface.changeColumn("activity", "started_at", {
                type: Sequelize.TIME,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "activity"
        );

        if (tableDefinition && tableDefinition["completed_at"]) {
            await queryInterface.changeColumn("activity", "completed_at", {
                type: Sequelize.DATE,
            });
        }

        if (tableDefinition && tableDefinition["started_at"]) {
            await queryInterface.changeColumn("activity", "started_at", {
                type: Sequelize.DATE,
            });
        }
    },
};
