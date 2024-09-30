"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");

    if (tableDefinition && !tableDefinition["version_number"]) {
      await queryInterface.addColumn("user_device_info", "version_number", {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");

    if (tableDefinition && tableDefinition["version_number"]) {
      await queryInterface.removeColumn("user_device_info", "version_number");
    }

  },
};
