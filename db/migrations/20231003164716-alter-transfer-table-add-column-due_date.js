'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer");
    if (tableDefinition && !tableDefinition["due_date"]) {
      await queryInterface.addColumn("transfer", "due_date", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer");
    if (tableDefinition && tableDefinition["due_date"]) {
      await queryInterface.removeColumn("transfer", "due_date");
    }
  },
};