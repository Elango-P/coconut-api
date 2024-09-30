'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_task");

    if (tableDefinition && !tableDefinition["project_id"]) {
      await queryInterface.addColumn("recurring_task", "project_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_task");

    if (tableDefinition && tableDefinition["project_id"]) {
      await queryInterface.removeColumn("recurring_task", "project_id");
    }
  },
};
