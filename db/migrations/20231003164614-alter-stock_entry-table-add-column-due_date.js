'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");
    if (tableDefinition && !tableDefinition["due_date"]) {
      await queryInterface.addColumn("stock_entry", "due_date", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");
    if (tableDefinition && tableDefinition["due_date"]) {
      await queryInterface.removeColumn("stock_entry", "due_date");
    }
  },
};