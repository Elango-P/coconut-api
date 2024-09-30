"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("vendor", "status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("vendor", "status");
        }
    },
};
