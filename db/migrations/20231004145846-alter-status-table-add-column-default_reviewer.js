'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["default_reviewer"]) {
      await queryInterface.addColumn("status", "default_reviewer", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["default_reviewer"]) {
      await queryInterface.removeColumn("status", "default_reviewer");
    }
  },
};