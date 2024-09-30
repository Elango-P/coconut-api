"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("custom_form_field_data", "custom_field_value");
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("custom_field_value", "custom_form_field_data");
    },
};
