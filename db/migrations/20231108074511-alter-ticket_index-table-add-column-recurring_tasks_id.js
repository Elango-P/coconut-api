'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_index");

    if (tableDefinition && !tableDefinition["recurring_task_id"]) {
      await queryInterface.addColumn("ticket_index", "recurring_task_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_index");

    if (tableDefinition && tableDefinition["recurring_task_id"]) {
      await queryInterface.removeColumn("ticket_index", "recurring_task_id");
    }
  },
};
