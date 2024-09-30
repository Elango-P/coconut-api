"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("custom_field", "tag_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("custom_field", "tag_id");
    },
};
