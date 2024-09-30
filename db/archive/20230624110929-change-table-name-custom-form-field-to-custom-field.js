"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("custom_form_field", "custom_field");
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("custom_field", "custom_form_field");
    },
};
