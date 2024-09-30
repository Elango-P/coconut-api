'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    if (tableDefinition && !tableDefinition["due_date"]) {
      await queryInterface.addColumn("bill", "due_date", {
        
          type: Sequelize.DATEONLY,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    if (tableDefinition && tableDefinition["due_date"]) {
      await queryInterface.removeColumn("bill", "due_date");
    }
  },
};