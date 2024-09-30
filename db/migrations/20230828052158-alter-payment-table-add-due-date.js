'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");
    if (tableDefinition && !tableDefinition["due_date"]) {
      await queryInterface.addColumn("payment", "due_date", {
        
          type: Sequelize.DATEONLY,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");
    if (tableDefinition && tableDefinition["due_date"]) {
      await queryInterface.removeColumn("payment", "due_date");
    }
  },
};
