"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "salary"
        );

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("salary", "status", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }


    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "salary"
        );

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn(
                "salary",
                "status"
            );
        }

    },
};
