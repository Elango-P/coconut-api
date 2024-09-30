'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("lead");
    if (tableDefinition && !tableDefinition["owner_id"]) {
      await queryInterface.addColumn("lead", "owner_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }
    if (tableDefinition && !tableDefinition["designation"]) {
      await queryInterface.addColumn("lead", "designation", {
          type: Sequelize.STRING,
          allowNull: true,
    
      });
    }
    
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("lead");
    if (tableDefinition && tableDefinition["owner_id"]) {
      await queryInterface.removeColumn("lead", "owner_id");
    }
    if (tableDefinition && tableDefinition["designation"]) {
      await queryInterface.removeColumn("lead", "designation");
    }
   
    
  },
};