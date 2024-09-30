'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("comment");
    if (tableDefinition && !tableDefinition["user_ids"]) {
      await queryInterface.addColumn("comment", "user_ids", {
          type: Sequelize.STRING,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("comment");
    if (tableDefinition && tableDefinition["user_ids"]) {
      await queryInterface.removeColumn("comment", "user_ids");
    }
  },
};