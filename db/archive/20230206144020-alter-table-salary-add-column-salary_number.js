"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("salary");

        if (tableDefinition && !tableDefinition["salary_number"]) {
            await queryInterface.addColumn("salary", "salary_number", {
                type: Sequelize.INTEGER,
                allowNull: true
            });
        }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("salary");

        if (tableDefinition && tableDefinition["salary_number"]) {
            await queryInterface.removeColumn("salary", "salary_number");
        }

    },
};
