'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("fine");
    if (tableDefinition && !tableDefinition["due_date"]) {
      await queryInterface.addColumn("fine", "due_date", {
        
          type: Sequelize.DATEONLY,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("fine");
    if (tableDefinition && tableDefinition["due_date"]) {
      await queryInterface.removeColumn("fine", "due_date");
    }
  },
};
