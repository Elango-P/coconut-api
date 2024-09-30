'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition && !tableDefinition["recurring_task_id"]) {
      await queryInterface.addColumn("ticket", "recurring_task_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition && tableDefinition["recurring_task_id"]) {
      await queryInterface.removeColumn("ticket", "recurring_task_id");
    }
  },
};
