"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");

        if (tableDefinition && !tableDefinition["device_id"]) {
          await queryInterface.changeColumn("inventory", "device_id", {
            type: Sequelize.STRING,
            allowNull: true,
        });
     }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");

        if (tableDefinition && tableDefinition["device_id"]) {
          await queryInterface.changeColumn("inventory", "device_id", {
            type: Sequelize.STRING,
            allowNull: false,
        });
        }
    },
};