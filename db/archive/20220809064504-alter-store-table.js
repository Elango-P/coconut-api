"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("store", "status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("store", "status");
        }
    },
};
