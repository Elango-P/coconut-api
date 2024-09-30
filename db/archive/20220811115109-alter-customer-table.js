"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("customer");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("customer", "status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("customer");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("customer", "status");
        }
    },
};
