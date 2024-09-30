'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["default_due_date"]) {
      await queryInterface.addColumn("status", "default_due_date", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["default_due_date"]) {
      await queryInterface.removeColumn("status", "default_due_date");
    }
  },
};