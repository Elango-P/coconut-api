"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor");

        if (tableDefinition && !tableDefinition["gst_number"]) {
            await queryInterface.addColumn("vendor", "gst_number", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor");

        if (tableDefinition && tableDefinition["gst_number"]) {
            await queryInterface.removeColumn("vendor", "gst_number");
        }
    },
};
