'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["default_owner"]) {
      await queryInterface.addColumn("status", "default_owner", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["default_owner"]) {
      await queryInterface.removeColumn("status", "default_owner");
    }
  },
};