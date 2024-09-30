"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && !tableDefinition["createdBy"]) {
            await queryInterface.addColumn("order", "createdBy", {
                type: Sequelize.STRING,
            });
        }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && tableDefinition["createdBy"]) {
            await queryInterface.removeColumn("order", "createdBy");
        }

    },
};
