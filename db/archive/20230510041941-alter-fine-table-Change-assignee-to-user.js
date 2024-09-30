"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("fine");

        if (tableDefinition && tableDefinition["assignee"]) {
            return queryInterface.renameColumn(
                "fine",
                "assignee",
                "user"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("fine");

        if (tableDefinition && tableDefinition["user"]) {
            return queryInterface.renameColumn(
                "fine",
                "user",
                "assignee"
            );
        }
    },
};
