"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("custom_field");

        if (tableDefinition && tableDefinition["tag_id"]) {
            await queryInterface.removeColumn("custom_field", "tag_id");
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("custom_field", "tag_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
};
