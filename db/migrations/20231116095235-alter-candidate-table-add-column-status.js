'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("candidate");
    if (tableDefinition && !tableDefinition["owner_id"]) {
      await queryInterface.addColumn("candidate", "owner_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }
    if (tableDefinition && !tableDefinition["notes"]) {
      await queryInterface.addColumn("candidate", "notes", {
          type: Sequelize.STRING,
          allowNull: true,
    
      });
    }
    
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("candidate");
    if (tableDefinition && tableDefinition["owner_id"]) {
      await queryInterface.removeColumn("candidate", "owner_id");
    }
    if (tableDefinition && tableDefinition["notes"]) {
      await queryInterface.removeColumn("candidate", "notes");
    }
    
    
  },
};