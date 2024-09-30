"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("system_setting");

        if (tableDefinition && tableDefinition["key"]) {
            return queryInterface.renameColumn(
                "system_setting",
                "key",
                "name"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("system_setting");

        if (tableDefinition && tableDefinition["name"]) {
            return queryInterface.renameColumn(
                "system_setting",
                "name",
                "key"
            );
        }
    },
};
