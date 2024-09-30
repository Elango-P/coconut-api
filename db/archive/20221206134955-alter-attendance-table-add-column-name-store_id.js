"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && !tableDefinition["store_id"]) {
            await queryInterface.addColumn("attendance", "store_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && tableDefinition["store_id"]) {
            await queryInterface.removeColumn("attendance", "store_id");
        }
    },
};
