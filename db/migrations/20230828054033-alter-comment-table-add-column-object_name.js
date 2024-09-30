'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("comment");
    if (tableDefinition && !tableDefinition["object_name"]) {
      await queryInterface.addColumn("comment", "object_name", {
          type: Sequelize.STRING,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("comment");
    if (tableDefinition && tableDefinition["object_name"]) {
      await queryInterface.removeColumn("comment", "object_name");
    }
  },
};