"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("custom_form_data", "inspection");
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("inspection", "custom_form_data");
    },
};
