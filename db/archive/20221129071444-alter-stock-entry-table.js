'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");
    if (tableDefinition && !tableDefinition["status"]) {
      await queryInterface.addColumn("stock_entry", "status", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("stock_entry", "status");
    }
  },
};
