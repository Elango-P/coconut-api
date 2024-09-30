"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("employee");

        if (tableDefinition && tableDefinition["updated_at"]) {
            return queryInterface.renameColumn(
                "employee",
                "updated_at",
                "updatedAt"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("employee");

        if (tableDefinition && tableDefinition["updatedAt"]) {
            return queryInterface.renameColumn(
                "employee",
                "updatedAt",
                "updated_at"
            );
        }
    },
};
