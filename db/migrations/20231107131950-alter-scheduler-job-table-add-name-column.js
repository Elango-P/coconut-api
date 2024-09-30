'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");
    if (tableDefinition && !tableDefinition["name"]) {
      await queryInterface.addColumn("scheduler_job", "name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");
    if (tableDefinition && tableDefinition["name"]) {
      await queryInterface.removeColumn("scheduler_job", "name");
    }
  },
};