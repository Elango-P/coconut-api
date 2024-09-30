"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");
    if (tableDefinition && !tableDefinition["status"]) {
      await queryInterface.addColumn("scheduler_job", "status", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");

    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("scheduler_job", "status");
    }
  }
};

