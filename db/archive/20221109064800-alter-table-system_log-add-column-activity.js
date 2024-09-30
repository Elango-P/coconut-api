"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("system_log");
    if (tableDefinition && !tableDefinition["activity"]) {
      await queryInterface.addColumn("system_log", "activity", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("system_log");

    if (tableDefinition && tableDefinition["activity"]) {
      await queryInterface.removeColumn("system_log", "activity");
    }
  }
};

