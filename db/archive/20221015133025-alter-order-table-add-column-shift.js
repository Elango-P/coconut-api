"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && !tableDefinition["shift"]) {
            await queryInterface.addColumn("order", "shift", {
              type: Sequelize.STRING,
              allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && tableDefinition["shift"]) {
            await queryInterface.removeColumn("order", "shift");
        }
    },
};
