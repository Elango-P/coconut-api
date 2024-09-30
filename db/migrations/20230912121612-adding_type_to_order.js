'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && !tableDefinition["type"]) {
      await queryInterface.addColumn("order", "type", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }
    
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && tableDefinition["type"]) {
      await queryInterface.removeColumn("order", "type");
    }
    
  },
};