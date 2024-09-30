'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");
    if (tableDefinition && !tableDefinition["due_date"]) {
      await queryInterface.addColumn("purchase", "due_date", {
        
          type: Sequelize.DATEONLY,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");
    if (tableDefinition && tableDefinition["due_date"]) {
      await queryInterface.removeColumn("purchase", "due_date");
    }
  },
};