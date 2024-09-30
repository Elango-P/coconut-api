"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && !tableDefinition["shift_id"]) {
            await queryInterface.addColumn("attendance", "shift_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && tableDefinition["shift_id"]) {
            await queryInterface.removeColumn("attendance", "shift_id");
        }
    },
};
