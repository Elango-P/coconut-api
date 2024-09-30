'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_task");
    if (tableDefinition && !tableDefinition["start_date"]) {
      await queryInterface.addColumn("recurring_task", "start_date", {
          type: Sequelize.DATE,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_task");
    if (tableDefinition && tableDefinition["start_date"]) {
      await queryInterface.removeColumn("recurring_task", "start_date");
    }
  },
};
