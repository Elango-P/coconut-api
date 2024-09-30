"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("stock_entry", "status", {
        type:  'INTEGER USING CAST("status" as INTEGER)',
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.changeColumn("stock_entry", "status", {

        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
